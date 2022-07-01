from cmath import e
from django.shortcuts import render
from django.http import JsonResponse
from agora_token_builder import RtcTokenBuilder 
import random
import time
# Token Generation 

# Create your views here.

def getToken(request):
    #Build token with uid
    #take below variables from agora site from the project you created from generate RTC Token
    appId = '960ec0ec9bce4fad9cb10c770e67cfc2' 
    appCertificate = '5ad5752ae0804c0487cd19e82b0ee196'
     #channel name will be requested from URL
    channelName = request.GET.get('channel')
    #uid should be between 1 and 230
    uid = random.randint(1,230)
    expirationTimeInSeconds = 3600*24
    #our expiration time is one day
    currentTimeStamp = int(time.time())
    privilegeExpiredTs = currentTimeStamp + expirationTimeInSeconds
    #if role is 1, it is host
    role = 1

    token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs)
    return JsonResponse({'token':token, 'uid':uid}, safe = False)
    #return value will be the token and the uid to the user


def lobby(request):
    return render(request, 'vcBase/lobby.html')

def room(request):
    return render(request, 'vcBase/room.html')
