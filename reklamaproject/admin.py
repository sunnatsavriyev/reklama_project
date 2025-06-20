from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import MetroLine, Station, Position, Advertisement

@admin.register(MetroLine)
class MetroLineAdmin(admin.ModelAdmin):
    list_display = ['id', 'name_uz', 'name_ru']
    search_fields = ['name_uz', 'name_ru']
    verbose_name = _("Metro liniyasi")
    verbose_name_plural = _("Metro liniyalari")

@admin.register(Station)
class StationAdmin(admin.ModelAdmin):
    list_display = ['id', 'name_uz', 'name_ru', 'line']
    list_filter = ['line']
    search_fields = ['name_uz', 'name_ru']
    verbose_name = _("Bekat")
    verbose_name_plural = _("Bekatlar")

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
        'Shartnoma_muddati_boshlanishi', 'Shartnoma_tugashi'
    ]
    list_filter = [
        'Qurilma_turi_uz', 'Qurilma_turi_ru',
        'Shartnoma_muddati_boshlanishi', 'Shartnoma_tugashi'
    ]
    search_fields = [
        'Reklama_nomi_uz', 'Reklama_nomi_ru',
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
