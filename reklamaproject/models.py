from django.db import models
from django.contrib.auth import get_user_model
from .validators import validate_file_extension
import logging
logger = logging.getLogger(__name__)

User = get_user_model()

class MetroLine(models.Model):
    name_uz = models.CharField(max_length=100, unique=True,null=True, help_text="Uzbekcha nomi")
    name_ru = models.CharField(max_length=100, unique=True,null=True, help_text="Ruscha nomi")
    # name_en = models.CharField(max_length=100, unique=True, help_text="Inglizcha nomi")

    def __str__(self):
        return str(self.name_uz or "No name")



class Station(models.Model):
    name_uz = models.CharField(max_length=100, help_text="Uzbekcha nomi",null=True, unique=True)
    name_ru = models.CharField(max_length=100, help_text="Ruscha nomi",null=True, unique=True)
    # name_en = models.CharField(max_length=100, help_text="Inglizcha nomi")
    line = models.ForeignKey(MetroLine, on_delete=models.CASCADE, related_name='stations', null=True, blank=True)
    schema_image = models.ImageField(upload_to='station_schemas/', null=True, blank=True, help_text="Bekat sxemasi rasmi")
    # x = models.FloatField(help_text='Horizontal position (0-100%)', null=True, blank=True)
    # y = models.FloatField(help_text='Vertical position (0-100%)', null=True, blank=True)
    def __str__(self):
        return f"{self.name_uz} ({self.line.name_uz})" if self.line and self.line.name_uz else self.name_uz or "No name"



class Position(models.Model):
    station = models.ForeignKey(Station, on_delete=models.CASCADE, related_name='positions')
    number = models.PositiveIntegerField(help_text="Joy raqami, masalan: 1, 2, 3")

    def __str__(self):
        return f"{self.station.name_uz} - Joy #{self.number}" if self.station else f"Joy #{self.number}"

    class Meta:
        unique_together = ('station', 'number')
        verbose_name = "Pozitsiya"
        verbose_name_plural = "Pozitsiyalar"
class Advertisement(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='ads')
    position = models.OneToOneField(Position, on_delete=models.CASCADE, related_name='advertisement', null=True, blank=True)
    Reklama_nomi_uz = models.CharField(max_length=255, default='Reklama nomi', help_text="Uzbekcha reklama nomi")
    Reklama_nomi_ru = models.CharField(max_length=255, default='Reklama nomi', help_text="Ruscha reklama nomi")
    Qurilma_turi_uz = models.CharField(max_length=100, default='led', help_text="Uzbekcha qurilma turi")
    Qurilma_turi_ru = models.CharField(max_length=100, default='led', help_text="Ruscha qurilma turi")
    Ijarachi_uz = models.CharField(max_length=255, help_text="Ijarachi_o'zbekcha", null=True, blank=True)
    Ijarachi_ru = models.CharField(max_length=255, help_text="Ijarachi_ruscha", null=True, blank=True)
    Shartnoma_raqami_uz = models.CharField(max_length=100, help_text="Shartnoma raqami o'zbekcha", null=True, blank=True)
    Shartnoma_raqami_ru = models.CharField(max_length=100, help_text="Shartnoma raqami ruscha", null=True, blank=True)
    Shartnoma_muddati_boshlanishi = models.DateField()
    Shartnoma_tugashi = models.DateField()
    O_lchov_birligi_uz = models.CharField(max_length=50, choices=[
        ('dona', 'Dona'),
        ('kv_metr', 'Kv metr'),
        ('komplekt', 'Komplekt')
    ],
    default='dona', help_text="O'lchov birligi o'zbekcha"
    )
    O_lchov_birligi_ru = models.CharField(max_length=50, choices=[
        ('штука', 'Штука'),
        ('кв. метр', 'Кв. метр'),
        ('комплект', 'Комплект')
    ],default='штука', help_text="O'lchov birligi ruscha"
    )
    Qurilma_narxi = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    Egallagan_maydon = models.DecimalField(max_digits=10, decimal_places=2, default=1)
    Shartnoma_summasi = models.DecimalField(max_digits=20, decimal_places=2 , default=0)
    Shartnoma_fayl = models.FileField(upload_to='contracts/', default=None, validators=[validate_file_extension], null=True, blank=True)
    photo = models.ImageField(upload_to='ad_photos/', validators=[validate_file_extension],)
    contact_number = models.CharField(max_length=20, default='+998')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.Reklama_nomi_uz} ({self.position})" if self.Reklama_nomi_uz else "Advertisement"
    

class AdvertisementArchive(models.Model):
    original_ad = models.ForeignKey('Advertisement', on_delete=models.SET_NULL, null=True, related_name='archives')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    line = models.ForeignKey('MetroLine', on_delete=models.SET_NULL, null=True, blank=True)
    station = models.ForeignKey('Station', on_delete=models.SET_NULL, null=True, blank=True)
    position = models.ForeignKey(Position, on_delete=models.SET_NULL, null=True, blank=True)
    Reklama_nomi_uz = models.CharField(max_length=255)
    Reklama_nomi_ru = models.CharField(max_length=255)
    Qurilma_turi_uz = models.CharField(max_length=100)
    Qurilma_turi_ru = models.CharField(max_length=100)
    Ijarachi_uz = models.CharField(max_length=255, null=True, blank=True)
    Ijarachi_ru = models.CharField(max_length=255, null=True, blank=True)
    Shartnoma_raqami_uz = models.CharField(max_length=100, null=True, blank=True)
    Shartnoma_raqami_ru = models.CharField(max_length=100, null=True, blank=True)
    Shartnoma_muddati_boshlanishi = models.DateField()
    Shartnoma_tugashi = models.DateField()
    O_lchov_birligi_uz = models.CharField(max_length=50)
    O_lchov_birligi_ru = models.CharField(max_length=50)
    Qurilma_narxi = models.DecimalField(max_digits=15, decimal_places=2)
    Egallagan_maydon = models.DecimalField(max_digits=10, decimal_places=2)
    Shartnoma_summasi = models.DecimalField(max_digits=20, decimal_places=2)
    Shartnoma_fayl = models.FileField(upload_to='contracts_archive/', null=True, blank=True)
    photo = models.ImageField(upload_to='ad_photos_archive/', null=True, blank=True)
    contact_number = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.Reklama_nomi_uz} ({self.position})"
