from decimal import Decimal
from datetime import date
from django.db.models import Count, Sum
from django.db.models.functions import TruncMonth
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Category, Expense
from .serializers import CategorySerializer, ExpenseSerializer
from .services import fetch_rates

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by("name")
    serializer_class = CategorySerializer

class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.select_related("category").all()
    serializer_class = ExpenseSerializer

@api_view(["GET"])
def health(request):
    return Response({"status": "ok"})

@api_view(["GET"])
def exchange_latest(request):
    base = request.query_params.get("base", "USD").upper()
    data = fetch_rates(base=base)
    return Response(data)

@api_view(["GET"])
def report_summary(request):
    # Summary metrics
    total_count = Expense.objects.count()
    total_amount = Expense.objects.aggregate(s=Sum("amount"))["s"] or Decimal("0.00")

    # Category breakdown
    by_category = (
        Expense.objects.values("category__name")
        .annotate(count=Count("id"), total=Sum("amount"))
        .order_by("-total")
    )

    # Monthly trend (last 6 months of data)
    monthly = (
        Expense.objects.annotate(month=TruncMonth("expense_date"))
        .values("month")
        .annotate(total=Sum("amount"), count=Count("id"))
        .order_by("month")
    )

    return Response({
        "metrics": {
            "total_expenses": total_count,
            "total_amount": str(total_amount),
        },
        "by_category": [
            {"category": r["category__name"], "count": r["count"], "total": str(r["total"] or 0)}
            for r in by_category
        ],
        "monthly": [
            {"month": r["month"].isoformat() if r["month"] else None, "count": r["count"], "total": str(r["total"] or 0)}
            for r in monthly
        ],
    })
