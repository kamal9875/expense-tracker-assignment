from django.contrib import admin
from .models import Category, Expense

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    search_fields = ("name",)

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "amount", "currency", "expense_date", "category")
    list_filter = ("currency", "expense_date", "category")
    search_fields = ("title", "notes")
