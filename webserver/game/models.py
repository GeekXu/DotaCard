from django.db import models

# Create your models here.
class User(models.Model):
    UserName = models.CharField(max_length = 15)
    Password = models.CharField(max_length = 40)
    Email = models.EmailField()
    EXP = models.IntegerField(default = 0)
    Prestige = models.IntegerField(default = 0)
    Win = models.IntegerField(default = 0)
    Lose = models.IntegerField(default = 0)
    Icon = models.IntegerField(default = 1)

    def __unicode__(self):
        return self.UserName
