from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import MetroLine, Station, Position, Advertisement, AdvertisementArchive

@admin.register(MetroLine)
class MetroLineAdmin(admin.ModelAdmin):
    list_display = ['id', 'name_uz', 'name_ru']
    search_fields = ['name_uz', 'name_ru']
    verbose_name = _("Metro liniyasi")
    verbose_name_plural = _("Metro liniyalari")

@admin.register(Station)
class StationAdmin(admin.ModelAdmin):
    list_display = ['id', 'name_uz', 'name_ru', 'line','schema_image_display']
    list_filter = ['line']
    search_fields = ['name_uz', 'name_ru']
    verbose_name = _("Bekat")
    verbose_name_plural = _("Bekatlar")
    def schema_image_display(self, obj):
        if obj.schema_image:
            return f"<img src='{obj.schema_image.url}' width='100' height='60' />"
        return "Yo'q"
    schema_image_display.allow_tags = True
    schema_image_display.short_description = "Sxema rasmi"

@admin.register(Position)
class PositionAdmin(admin.ModelAdmin):
    list_display = ['id', 'station', 'number']
    list_filter = ['station']
    search_fields = ['station__name_uz', 'station__name_ru']
    verbose_name = _("Joylashuv")
    verbose_name_plural = _("Joylashuvlar")

@admin.register(Advertisement)
class AdvertisementAdmin(admin.ModelAdmin):
    list_display = [
        'Reklama_nomi_uz', 'Reklama_nomi_ru', 'Ijarachi_uz', 'Ijarachi_ru',
        'get_station', 'Qurilma_turi_uz', 'Qurilma_turi_ru',
        'Shartnoma_raqami_uz', 'Shartnoma_raqami_ru',
        'Shartnoma_muddati_boshlanishi', 'Shartnoma_tugashi','O_lchov_birligi_uz', 'O_lchov_birligi_ru',
        'Qurilma_narxi', 'Egallagan_maydon', 'Shartnoma_summasi','Shartnoma_fayl',
    ]
    list_filter = [
        'Ijarachi_uz', 'Ijarachi_ru',
        'Qurilma_turi_uz', 'Qurilma_turi_ru'
    ]
    search_fields = [
        'Ijarachi_uz', 'Ijarachi_ru',
        'Qurilma_turi_uz', 'Qurilma_turi_ru'
    ]
    verbose_name = _("Reklama")
    verbose_name_plural = _("Reklamalar")

    @admin.display(description=_("Bekat"))
    def get_station(self, obj):
        if obj.position and obj.position.station:
            return f"{obj.position.station.name_uz} / {obj.position.station.name_ru}"
        return "-"
@admin.register(AdvertisementArchive)
class AdvertisementArchiveAdmin(admin.ModelAdmin):
    list_display = ['Reklama_nomi_uz', 'original_ad', 'Shartnoma_raqami_uz', 'user', 'created_at']
    search_fields = ['Reklama_nomi_uz', 'Shartnoma_raqami_uz']
    list_filter = ['created_at', 'user']
    readonly_fields = [  # Arxiv faqat ko‘rish uchun bo‘lishi mumkin
        'original_ad', 'user', 'position', 'Reklama_nomi_uz', 'Reklama_nomi_ru',
        'Qurilma_turi_uz', 'Qurilma_turi_ru', 'Ijarachi_uz', 'Ijarachi_ru',
        'Shartnoma_raqami_uz', 'Shartnoma_raqami_ru',
        'Shartnoma_muddati_boshlanishi', 'Shartnoma_tugashi',
        'O_lchov_birligi_uz', 'O_lchov_birligi_ru', 'Qurilma_narxi',
        'Egallagan_maydon', 'Shartnoma_summasi', 'Shartnoma_fayl',
        'photo', 'contact_number', 'created_at'
    ]

    def has_add_permission(self, request):
        return False  # qo‘shish kerak emas

    def has_change_permission(self, request, obj=None):
        return False  # o‘zgartirish kerak emas

    def has_delete_permission(self, request, obj=None):
        return False  # o‘chirish ham kerak emas