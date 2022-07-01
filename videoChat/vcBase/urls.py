#File created manually

from django.urls import path 
from . import views

urlpatterns = [

    path('',views.lobby),  
    path('room/',views.room),
    #sending a request before we get a token
    path('get_token/',views.getToken)
]
#Adding url patterns