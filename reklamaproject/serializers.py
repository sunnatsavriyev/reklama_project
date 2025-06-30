from rest_framework import serializers
from .models import Advertisement, Station, MetroLine, Position, AdvertisementArchive
from rest_framework.fields import CurrentUserDefault
class MetroLineSerializer(serializers.ModelSerializer):
    class Meta:
        model = MetroLine
        fields = ['id', 'name_uz', 'name_ru']



class StationSerializer(serializers.ModelSerializer):
    line_name_uz = serializers.CharField(source='line.name_uz', read_only=True)
    line_name_ru = serializers.CharField(source='line.name_ru', read_only=True)

    class Meta:
        model = Station
        fields = ['id', 'name_uz', 'name_ru', 'line', 'line_name_uz', 'line_name_ru','schema_image']

    def get_line_name(self, obj):
        if obj.line:
            return f"{obj.line.name_uz} / {obj.line.name_ru}"
        return "-"

# serializers.py

class AdvertisementSerializer(serializers.ModelSerializer):
    station = serializers.CharField(source='position.station.name_uz', read_only=True)
    position_number = serializers.IntegerField(source='position.number', read_only=True)

    # Reklama ko'rishda barcha pozitsiyalar bo'lishi mumkin
    position = serializers.PrimaryKeyRelatedField(queryset=Position.objects.all())

    class Meta:
        model = Advertisement
        fields = [
            'id', 'user', 'position', 'station', 'position_number',
            'Reklama_nomi_uz', 'Reklama_nomi_ru',
            'Qurilma_turi_uz', 'Qurilma_turi_ru',
            'Ijarachi_uz', 'Ijarachi_ru',
            'Shartnoma_raqami_uz', 'Shartnoma_raqami_ru',
            'Shartnoma_muddati_boshlanishi', 'Shartnoma_tugashi',
            'O_lchov_birligi_uz', 'O_lchov_birligi_ru',
            'Qurilma_narxi', 'Egallagan_maydon', 'Shartnoma_summasi',
            'Shartnoma_fayl', 'photo', 'contact_number', 'created_at'
        ]
        read_only_fields = ['user']

# Reklama YARATISH uchun — faqat advertisement bo'sh joylar
class CreateAdvertisementSerializer(AdvertisementSerializer):
    position = serializers.PrimaryKeyRelatedField(queryset=Position.objects.none(), required=False)
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        if self.instance:
            current_position = self.instance.position
            bosh_joylar = Position.objects.filter(advertisement__isnull=True)

            if current_position:
                bosh_joylar = bosh_joylar | Position.objects.filter(pk=current_position.pk)

            self.fields['position'].queryset = bosh_joylar.distinct()
        else:
            self.fields['position'].queryset = Position.objects.filter(advertisement__isnull=True)

    def validate(self, attrs):
        # Faqat create bo‘lganda shartnoma raqamini tekshirish
        if not self.instance:
            shartnoma_raqami = attrs.get('Shartnoma_raqami_uz')
            if Advertisement.objects.filter(Shartnoma_raqami_uz=shartnoma_raqami).exists():
                raise serializers.ValidationError({
                    'Shartnoma_raqami_uz': 'Bu shartnoma raqami allaqachon mavjud.'
                })
        return attrs

    def update(self, instance, validated_data):
        if 'position' not in validated_data:
            validated_data['position'] = instance.position
        return super().update(instance, validated_data)
class PositionSerializer(serializers.ModelSerializer):
    advertisement = AdvertisementSerializer(read_only=True)
    class Meta:
        model = Position
        fields = ['id', 'station', 'number','advertisement']

class AdvertisementArchiveSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username', read_only=True)
    line_name_uz = serializers.CharField(source='line.name_uz', read_only=True)
    station_name_uz = serializers.CharField(source='station.name_uz', read_only=True)
    class Meta:
        model = AdvertisementArchive
        fields = '__all__'


class ExportAdvertisementSerializer(serializers.Serializer):
    position = serializers.PrimaryKeyRelatedField(queryset=Position.objects.all())

    def validate_position(self, value):
        if not value:
            raise serializers.ValidationError("Joy tanlanishi shart.")
        return value