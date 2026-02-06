from rest_framework import serializers
from .models import Category, Expense

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]

class ExpenseSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model = Expense
        fields = [
            "id", "title", "amount", "currency", "expense_date", "notes",
            "category", "category_name", "created_at", "updated_at"
        ]
