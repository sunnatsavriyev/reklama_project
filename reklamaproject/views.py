from rest_framework import viewsets, permissions, filters
from .models import MetroLine, Station, Position, Advertisement, AdvertisementArchive
from .serializers import (
    MetroLineSerializer, StationSerializer,
    PositionSerializer, AdvertisementSerializer, AdvertisementArchiveSerializer, CreateAdvertisementSerializer, ExportAdvertisementSerializer
)

from rest_framework import status
from django.db import transaction
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_me(request):
    return Response({
        "id": request.user.id,
        "username": request.user.username,
        "is_superuser": request.user.is_superuser,
        "email": request.user.email,
    })

class AuthenticatedCRUDPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

class MetroLineViewSet(viewsets.ModelViewSet):
    queryset = MetroLine.objects.all()
    serializer_class = MetroLineSerializer
    permission_classes = [AuthenticatedCRUDPermission]

class StationViewSet(viewsets.ModelViewSet):
    queryset = Station.objects.all()
    serializer_class = StationSerializer
    permission_classes = [AuthenticatedCRUDPermission]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['line']

class PositionViewSet(viewsets.ModelViewSet):
    queryset = Position.objects.select_related('station').prefetch_related('advertisement').all()
    serializer_class = PositionSerializer
    permission_classes = [AuthenticatedCRUDPermission]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['station']

class AdvertisementViewSet(viewsets.ModelViewSet):
    queryset = Advertisement.objects.all()
    serializer_class = AdvertisementSerializer
    permission_classes = [AuthenticatedCRUDPermission]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    search_fields = ['Reklama_nomi_uz', 'Shartnoma_raqami_uz']
    ordering_fields = ['created_at', 'Qurilma_narxi']
    filterset_fields = ['position__station', 'position__station__line']

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return CreateAdvertisementSerializer
        return AdvertisementSerializer

    def perform_create(self, serializer):
        serializer.save()

    def perform_update(self, serializer):
        old_instance = self.get_object()
        station = old_instance.position.station if old_instance.position else None
        line = station.line if station else None

        AdvertisementArchive.objects.create(
            original_ad=old_instance,
            user=old_instance.user,
            position=old_instance.position,
            line=line,
            station=station,
            Reklama_nomi_uz=old_instance.Reklama_nomi_uz,
            Reklama_nomi_ru=old_instance.Reklama_nomi_ru,
            Qurilma_turi_uz=old_instance.Qurilma_turi_uz,
            Qurilma_turi_ru=old_instance.Qurilma_turi_ru,
            Ijarachi_uz=old_instance.Ijarachi_uz,
            Ijarachi_ru=old_instance.Ijarachi_ru,
            Shartnoma_raqami_uz=old_instance.Shartnoma_raqami_uz,
            Shartnoma_raqami_ru=old_instance.Shartnoma_raqami_ru,
            Shartnoma_muddati_boshlanishi=old_instance.Shartnoma_muddati_boshlanishi,
            Shartnoma_tugashi=old_instance.Shartnoma_tugashi,
            O_lchov_birligi_uz=old_instance.O_lchov_birligi_uz,
            O_lchov_birligi_ru=old_instance.O_lchov_birligi_ru,
            Qurilma_narxi=old_instance.Qurilma_narxi,
            Egallagan_maydon=old_instance.Egallagan_maydon,
            Shartnoma_summasi=old_instance.Shartnoma_summasi,
            Shartnoma_fayl=old_instance.Shartnoma_fayl,
            photo=old_instance.photo,
            contact_number=old_instance.contact_number,
        )
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['get', 'post'], url_path='export')
    def export_advertisement(self, request, pk=None):
        source_ad = self.get_object()

        if request.method == 'GET':
            serializer = ExportAdvertisementSerializer()
            return Response(serializer.data)

        serializer = ExportAdvertisementSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        target_position = serializer.validated_data['position']

        with transaction.atomic():
            # 1. Target joydagi reklamani arxivga yuboramiz (agar mavjud bo‘lsa)
            target_ad = getattr(target_position, 'advertisement', None)
            if target_ad:
                target_station = target_ad.position.station
                target_line = target_station.line

                AdvertisementArchive.objects.create(
                    original_ad=target_ad,
                    user=target_ad.user,
                    position=target_ad.position,
                    line=target_line,
                    station=target_station,
                    Reklama_nomi_uz=target_ad.Reklama_nomi_uz,
                    Reklama_nomi_ru=target_ad.Reklama_nomi_ru,
                    Qurilma_turi_uz=target_ad.Qurilma_turi_uz,
                    Qurilma_turi_ru=target_ad.Qurilma_turi_ru,
                    Ijarachi_uz=target_ad.Ijarachi_uz,
                    Ijarachi_ru=target_ad.Ijarachi_ru,
                    Shartnoma_raqami_uz=target_ad.Shartnoma_raqami_uz,
                    Shartnoma_raqami_ru=target_ad.Shartnoma_raqami_ru,
                    Shartnoma_muddati_boshlanishi=target_ad.Shartnoma_muddati_boshlanishi,
                    Shartnoma_tugashi=target_ad.Shartnoma_tugashi,
                    O_lchov_birligi_uz=target_ad.O_lchov_birligi_uz,
                    O_lchov_birligi_ru=target_ad.O_lchov_birligi_ru,
                    Qurilma_narxi=target_ad.Qurilma_narxi,
                    Egallagan_maydon=target_ad.Egallagan_maydon,
                    Shartnoma_summasi=target_ad.Shartnoma_summasi,
                    Shartnoma_fayl=target_ad.Shartnoma_fayl,
                    photo=target_ad.photo,
                    contact_number=target_ad.contact_number,
                )
                # 2. Target joydagi eski reklamani o‘chiramiz
                target_ad.delete()

            # 3. Source reklamani target pozitsiyaga nusxalaymiz
            Advertisement.objects.create(
                user=source_ad.user,
                position=target_position,
                Reklama_nomi_uz=source_ad.Reklama_nomi_uz,
                Reklama_nomi_ru=source_ad.Reklama_nomi_ru,
                Qurilma_turi_uz=source_ad.Qurilma_turi_uz,
                Qurilma_turi_ru=source_ad.Qurilma_turi_ru,
                Ijarachi_uz=source_ad.Ijarachi_uz,
                Ijarachi_ru=source_ad.Ijarachi_ru,
                Shartnoma_raqami_uz=source_ad.Shartnoma_raqami_uz,
                Shartnoma_raqami_ru=source_ad.Shartnoma_raqami_ru,
                Shartnoma_muddati_boshlanishi=source_ad.Shartnoma_muddati_boshlanishi,
                Shartnoma_tugashi=source_ad.Shartnoma_tugashi,
                O_lchov_birligi_uz=source_ad.O_lchov_birligi_uz,
                O_lchov_birligi_ru=source_ad.O_lchov_birligi_ru,
                Qurilma_narxi=source_ad.Qurilma_narxi,
                Egallagan_maydon=source_ad.Egallagan_maydon,
                Shartnoma_summasi=source_ad.Shartnoma_summasi,
                Shartnoma_fayl=source_ad.Shartnoma_fayl,
                photo=source_ad.photo,
                contact_number=source_ad.contact_number,
            )

            # 4. Source reklamani arxivga yuboramiz
            source_station = source_ad.position.station
            source_line = source_station.line

            AdvertisementArchive.objects.create(
                original_ad=source_ad,
                user=source_ad.user,
                position=source_ad.position,
                line=source_line,
                station=source_station,
                Reklama_nomi_uz=source_ad.Reklama_nomi_uz,
                Reklama_nomi_ru=source_ad.Reklama_nomi_ru,
                Qurilma_turi_uz=source_ad.Qurilma_turi_uz,
                Qurilma_turi_ru=source_ad.Qurilma_turi_ru,
                Ijarachi_uz=source_ad.Ijarachi_uz,
                Ijarachi_ru=source_ad.Ijarachi_ru,
                Shartnoma_raqami_uz=source_ad.Shartnoma_raqami_uz,
                Shartnoma_raqami_ru=source_ad.Shartnoma_raqami_ru,
                Shartnoma_muddati_boshlanishi=source_ad.Shartnoma_muddati_boshlanishi,
                Shartnoma_tugashi=source_ad.Shartnoma_tugashi,
                O_lchov_birligi_uz=source_ad.O_lchov_birligi_uz,
                O_lchov_birligi_ru=source_ad.O_lchov_birligi_ru,
                Qurilma_narxi=source_ad.Qurilma_narxi,
                Egallagan_maydon=source_ad.Egallagan_maydon,
                Shartnoma_summasi=source_ad.Shartnoma_summasi,
                Shartnoma_fayl=source_ad.Shartnoma_fayl,
                photo=source_ad.photo,
                contact_number=source_ad.contact_number,
            )

            # 5. Source joyni bo‘shatamiz
            source_ad.delete()

        return Response({'detail': 'Reklama muvaffaqiyatli ko‘chirildi, arxivlandi va source joy tozalandi.'}, status=200)

class AdvertisementArchiveViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AdvertisementArchive.objects.all().order_by('-created_at')
    serializer_class = AdvertisementArchiveSerializer
    permission_classes = [AuthenticatedCRUDPermission]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    search_fields = ['Reklama_nomi_uz', 'Shartnoma_raqami_uz']
    ordering_fields = ['created_at', 'Qurilma_narxi']
    filterset_fields = ['line','station', 'position']
