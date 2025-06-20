from rest_framework.routers import DefaultRouter
from .views import MetroLineViewSet, StationViewSet, PositionViewSet, AdvertisementViewSet

router = DefaultRouter()
router.register(r'lines', MetroLineViewSet)
router.register(r'stations', StationViewSet)
router.register(r'positions', PositionViewSet)
router.register(r'advertisements', AdvertisementViewSet)

urlpatterns = router.urls