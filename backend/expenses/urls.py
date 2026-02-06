from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ExpenseViewSet, report_summary, exchange_latest, health

router = DefaultRouter()
router.register(r"categories", CategoryViewSet, basename="category")
router.register(r"expenses", ExpenseViewSet, basename="expense")

urlpatterns = [
    path("health/", health),
    path("", include(router.urls)),
    path("reports/summary/", report_summary),
    path("integrations/exchange/latest/", exchange_latest),
]
