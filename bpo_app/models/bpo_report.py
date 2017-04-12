"""BPO Report Model."""

from django.db import models
from djangotoolbox import fields as mongodb_fields
from django_mongodb_engine.contrib import MongoDBManager
from django.contrib.auth.models import User

from alsta_conveyance.models import AlstaConveyance
from alsta_assessor.models import AlstaAssessor


class BPOReport(models.Model):
    """Model for a BPO Report"""
    owner_id = models.ForeignKey(User, db_column='owner_id', max_length=25)
    title = models.CharField(max_length=255)
    template = models.BooleanField(null=True, blank=True)
    subtopics = mongodb_fields.ListField()
    conveyance_record = models.ForeignKey(AlstaConveyance, db_column='conveyance_record', blank=True, null=True)
    assessment_record = models.ForeignKey(AlstaAssessor, db_column='assessment_record', blank=True, null=True)
    template_id = models.ForeignKey('BPOReport', db_column='template_id', blank=True, null=True)

    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    objects = MongoDBManager()

    class Meta:
        db_table = 'bpo_reports'

    @property
    def to_json(self):
        """JSON object."""
        return {
            'id': self.id,
            'title': self.title,
            'template': self.template,
            'topics': [str(topic_id) for topic_id in self.subtopics]
        }
