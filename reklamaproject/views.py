from rest_framework import viewsets, permissions, filters
from .models import MetroLine, Station, Position, Advertisement, AdvertisementArchive
from .serializers import (
    MetroLineSerializer, StationSerializer,
    PositionSerializer, AdvertisementSerializer, AdvertisementArchiveSerializer
)
from rest_framework.decorators import api_view, permission_classes
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
    queryset = Position.objects.all()
    serializer_class = PositionSerializer
    permission_classes = [AuthenticatedCRUDPermission]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['station']

    def get_queryset(self):
        used_positions = Advertisement.objects.values_list('position_id', flat=True)
        return Position.objects.exclude(id__in=used_positions)

class AdvertisementViewSet(viewsets.ModelViewSet):
    queryset = Advertisement.objects.all()
    serializer_class = AdvertisementSerializer
    permission_classes = [AuthenticatedCRUDPermission]
    filter_backends = [filters.SearchFilter]
    search_fields = ['Reklama_nomi_uz', 'Shartnoma_raqami_uz']

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        old_instance = self.get_object()
        AdvertisementArchive.objects.create(
            original_ad=old_instance,
            user=old_instance.user,
            position=old_instance.position,
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

class AdvertisementArchiveViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AdvertisementArchive.objects.all().order_by('-created_at')
    serializer_class = AdvertisementArchiveSerializer
    permission_classes = [AuthenticatedCRUDPermission]

    
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['Reklama_nomi_uz', 'Shartnoma_raqami_uz']
    ordering_fields = ['created_at', 'Qurilma_narxi']
