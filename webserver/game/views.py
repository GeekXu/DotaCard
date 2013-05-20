# Create your views here.
from django.shortcuts import render_to_response, get_object_or_404
from game.models import User
from django.http import HttpResponseRedirect, HttpResponse
from django.core.urlresolvers import reverse
from django.template import RequestContext
from django.contrib import auth
from django.core.context_processors import csrf
import time
import pdb
import json

def index(request):    
    return render_to_response('game_index.html',)


def login(request):
    
    response = HttpResponse()
    response['Content-Type'] = 'application/json'
    
    #if request.GET:
    username = request.GET.get('username')
    pwd = request.GET.get('password')
    result = {"result":"FAIL"}

    #u = auth.authenticate(UserName = username,Password = pwd)
    u = User.objects.filter(UserName = username).filter(Password = pwd)
    if u:
        request.session['username'] = username
        result["result"] = "SUCCESS"
                    
    response.write(json.dumps(result))
    return response

def onready(request):
    return render_to_response('static/gamepage/index.html',)
    

def register_page(request):
    return render_to_response('game_register.html',)

def register(request):
    if request.GET:
        username = request.GET.get('username')
        pwd = request.GET.get('password')
        email = request.GET.get('email')

        u = User.objects.filter(UserName = username)
        if u:
            return HttpResponse("The name has already been used.")
        else:
            u = User(UserName = username,Password = pwd,Email = email)
            u.save()
            return HttpResponseRedirect("/game/")
"""
def test(request):
    return render_to_response('test.html')
            
def room(request):
	return render_to_response('room.html')

def hall(request):
    return render_to_response('game_hall.html',{'username':request.session['username']})
"""
#def login_success(request):
#    return HttpResponse("game_hall.html")
