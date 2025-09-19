from rest_framework.routers import DefaultRouter
from .views import (MetroLineViewSet, StationViewSet, PositionViewSet, AdvertisementViewSet, AdvertisementArchiveViewSet, Last10AdvertisementImagesView, 
        get_me, ExpiredAdvertisementViewSet, Stationimage, AllAdvertisementsViewSet, CheckAuthView, AdvertisementStatisticsView,StatisticsCountAPI)
from django.urls import path
router = DefaultRouter()
router.register(r'lines', MetroLineViewSet)
router.register(r'stations', StationViewSet)
router.register(r'positions', PositionViewSet)
router.register(r'advertisements', AdvertisementViewSet)
router.register(r'advertisements-archive', AdvertisementArchiveViewSet)
router.register(r'tugashi-advertisements', ExpiredAdvertisementViewSet, basename='tugashi-advertisements')
router.register(r'all-advertisements', AllAdvertisementsViewSet, basename='all-advertisements')

urlpatterns =  [
    path("advertisements/statistics/", AdvertisementStatisticsView.as_view(), name="advertisement-statistics"),
    path('me/', get_me, name='get_me'), 
    path("stations/<int:pk>/update-image/", Stationimage.as_view(), name="station-update-image"),
    path('auth/check/', CheckAuthView.as_view(), name='check-auth'),
    path("advertisements/last-10-images/", Last10AdvertisementImagesView.as_view(), name="last-10-advertisements-images"),
     path("count/", StatisticsCountAPI.as_view(), name="statistics-count"),
    # path("stations/<int:pk>/search-number/", StationSearchAllNumbers.as_view(), name="station-search-number"),

]+router.urls 


