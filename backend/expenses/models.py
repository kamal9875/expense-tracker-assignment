from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=80, unique=True)

    def __str__(self):
        return self.name

class Expense(models.Model):
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="expenses")
    title = models.CharField(max_length=120)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3, default="INR")
    expense_date = models.DateField()
    notes = models.TextField(blank=True, default="")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-expense_date", "-id"]

    def __str__(self):
        return f"{self.title} {self.amount} {self.currency}"
