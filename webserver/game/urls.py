from django.conf.urls import patterns, include,url
from django.conf import settings

urlpatterns = patterns('game.views',
    url(r'^$','index'),
    url(r'^register_page/$','register_page'),   
    #url(r'^room/$','room'),
    url(r'^register/$','register'),
    url(r'^login/$','login'),
    url(r'^onready/$','onready'),
    #url(r'^hall/$','hall'),
    #url(r'^test/$','test'),
    url(r'^static/(?P<path>.*)$','django.views.static.serve',
        {'document_root': 'E:/pl2/templates/'}),
    #url(r'^gamestatic/(?P<path>.*)$','django.views.static.serve',
    #    {'document_root': 'E:/pl2/templates/gamepage'}),
)
