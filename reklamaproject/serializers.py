from rest_framework import serializers
from .models import Advertisement, Station, MetroLine, Position

class MetroLineSerializer(serializers.ModelSerializer):
    class Meta:
        model = MetroLine
        fields = ['id', 'name_uz', 'name_ru']

class PositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Position
        fields = ['id', 'station', 'number']

class StationSerializer(serializers.ModelSerializer):
    line_name_uz = serializers.CharField(source='line.name_uz', read_only=True)
    line_name_ru = serializers.CharField(source='line.name_ru', read_only=True)

    class Meta:
        model = Station
        fields = ['id', 'name_uz', 'name_ru', 'line', 'line_name_uz', 'line_name_ru']

    def get_line_name(self, obj):
        if obj.line:
            return f"{obj.line.name_uz} / {obj.line.name_ru}"
        return "-"

class AdvertisementSerializer(serializers.ModelSerializer):
    station = serializers.CharField(source='position.station.name_uz', read_only=True)
    position_number = serializers.IntegerField(source='position.number', read_only=True)

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
