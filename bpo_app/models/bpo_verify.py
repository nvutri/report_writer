"""BPO Report Verified Input."""

from django_mongodb_engine.contrib import MongoDBManager
from django.contrib.auth.models import User
from django.db import models


class BPOVerifiedAssessment(models.Model):
    """Model for a BPO Report Verified Assessment data."""
    verified_user = models.ForeignKey(User)
    created = models.DateTimeField(auto_now_add=True)
    dataset = models.CharField(max_length=250, default='alsta_assessor')

    address = models.CharField(max_length=250, blank=True, null=True)
    parcel_id = models.CharField(max_length=250, blank=True, null=True)
    parish = models.CharField(max_length=250, blank=True, null=True)
    zipcode = models.CharField(max_length=250, blank=True, null=True)
    city = models.CharField(max_length=250, blank=True, null=True)
    state = models.CharField(max_length=250, blank=True, null=True)

    # Optional fields.
    subdivision = models.CharField(max_length=250, blank=True, null=True)
    square = models.CharField(max_length=250, blank=True, null=True)
    block = models.CharField(max_length=250, blank=True, null=True)
    section = models.CharField(max_length=250, blank=True, null=True)
    tract = models.CharField(max_length=250, blank=True, null=True)
    range = models.CharField(max_length=250, blank=True, null=True)
    unit = models.CharField(max_length=250, blank=True, null=True)
    township = models.CharField(max_length=250, blank=True, null=True)
    ward = models.CharField(max_length=250, blank=True, null=True)

    # Area.
    shape_length = models.FloatField(blank=True, null=True)
    shape_area = models.FloatField(blank=True, null=True)
    map_acres = models.FloatField(blank=True, null=True)

    objects = MongoDBManager()

    class Meta:
        db_table = 'bpo_assessment_verified'
