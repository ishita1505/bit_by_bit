
from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',include('vcBase.urls'))  #Directing the page to the urls file in the app vcBase
]
