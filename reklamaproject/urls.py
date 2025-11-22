from rest_framework.routers import DefaultRouter
from .views import (MetroLineViewSet, StationViewSet, PositionViewSet, AdvertisementViewSet, AdvertisementArchiveViewSet, Last10AdvertisementImagesView, 
        get_me, ExpiredAdvertisementViewSet, Stationimage, AllAdvertisementsViewSet, CheckAuthView, IjarachiViewSet,TuriViewSet,ShartnomaSummasiViewSet,
        AdvertisementStatisticsView,StatisticsCountAPI, AdvertisementStatisticsViewSet, IjarachiStatisticsViewSet, IjarachiSumStatisticsViewSet,TarkibAdvertisementArchiveViewSet,
    TarkibExpiredAdvertisementViewSet,DepoViewSet,TarkibAdvertisementViewSet,TarkibPositionViewSet,TarkibAllAdvertisementViewSet,TarkibViewSet,TarkibShardnomaSummasiViewSet
)
from django.urls import path
router = DefaultRouter()
router.register(r'lines', MetroLineViewSet)
router.register(r'stations', StationViewSet)
router.register(r'positions', PositionViewSet)
router.register(r'advertisements', AdvertisementViewSet)
router.register(r'advertisements-archive', AdvertisementArchiveViewSet)
router.register(r'tugashi-advertisements', ExpiredAdvertisementViewSet, basename='tugashi-advertisements')
router.register(r'all-advertisements', AllAdvertisementsViewSet, basename='all-advertisements')
router.register(r"ijarachilar", IjarachiViewSet, basename="ijarachilar")
router.register(r"turi", TuriViewSet, basename="turi")
router.register('shartnoma-summalari', ShartnomaSummasiViewSet, basename='shartnoma-summasi')
router.register(r'tarkib-adv-archive', TarkibAdvertisementArchiveViewSet, basename='tarkib-adv-archive')
router.register(r'depo', DepoViewSet, basename='depo')
router.register(r'tarkib-advertisement', TarkibAdvertisementViewSet, basename='tarkib-advertisement')
router.register(r'tarkib-position', TarkibPositionViewSet, basename='tarkib-position')
router.register(r'tarkib', TarkibViewSet, basename='tarkib')
router.register('tarkib-shartnoma-summalari', TarkibShardnomaSummasiViewSet, basename='tarkib-shartnoma-summasi')
router.register(r'advertisements/statistics-viewset', AdvertisementStatisticsViewSet, basename='advertisement-statistics-viewset')
router.register(r'ijarachilar/statistics', IjarachiStatisticsViewSet, basename='ijarachi-statistics')
router.register(r'ijarachilar/sum-statistics', IjarachiSumStatisticsViewSet, basename='ijarachi-sum-statistics')
router.register(r'tarkib-advertisement-tugashi', TarkibExpiredAdvertisementViewSet, basename='tarkib-advertisement-tugashi')
router.register(r'all-tarkib-advertisements', TarkibAllAdvertisementViewSet, basename='all-tarkib-advertisements')


urlpatterns =  [
    path("advertisements/statistics/", AdvertisementStatisticsView.as_view(), name="advertisement-statistics"),
    path('me/', get_me, name='get_me'), 
    path("stations/<int:pk>/update-image/", Stationimage.as_view(), name="station-update-image"),
    path('auth/check/', CheckAuthView.as_view(), name='check-auth'),
    path("advertisements/last-10-images/", Last10AdvertisementImagesView.as_view(), name="last-10-advertisements-images"),
    path("count/", StatisticsCountAPI.as_view(), name="statistics-count"),
    # path("stations/<int:pk>/search-number/", StationSearchAllNumbers.as_view(), name="station-search-number"),

]+router.urls 


