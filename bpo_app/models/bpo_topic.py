"""BPO Report Topic Model."""

from django.db import models
from djangotoolbox import fields as mongodb_fields
from django_mongodb_engine.contrib import MongoDBManager
from bpo.models.bpo_field import BPOField


class BPOTopic(models.Model):
    """Model for a BPO Report Topic."""
    TOPIC_TYPES = [
        'topic',
        'topic_list'
    ]
    title = models.CharField(max_length=255)
    fields = mongodb_fields.ListField(blank=True, null=True)
    row_indexes = mongodb_fields.ListField(blank=True, null=True)
    subtopics = mongodb_fields.ListField(blank=True, null=True)
    type = models.CharField(max_length=255, choices=TOPIC_TYPES)

    objects = MongoDBManager()

    class Meta:
        db_table = 'bpo_report_topics'

    @property
    def to_json(self):
        """JSON object."""
        return {
            'id': self.id,
            'title': self.title,
            'type': self.type,
            'fields': [str(field_id) for field_id in self.fields] if self.fields else [],
            'subtopics': [str(topic_id) for topic_id in self.subtopics] if self.subtopics else [],
            'row_ids': self.row_ids
        }

    @property
    def row_ids(self):
        """Get fields that are actually row."""
        if self.fields:
            return {field.id: field.row for field in BPOField.objects.filter(id__in=self.fields)}
        else:
            return None
