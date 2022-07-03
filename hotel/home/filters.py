import django_filters
from .models import Hotel

class HotelFilter(django_filters.FilterSet):
  price = django_filters.AllValuesFilter()

  class Meta:
      model = Hotel
      fields = ['hotel_price']