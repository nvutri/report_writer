"""BPO Report Field Model."""

from django.db import models
from django_mongodb_engine.contrib import MongoDBManager
from djangotoolbox import fields as mongodb_fields


class BPOBaseField(models.Model):
    """Model for a BPO Base field."""
    SIZE_RANGE = [1, 12]
    size = models.PositiveIntegerField(blank=True, null=True, default=6)
    label_size = models.PositiveIntegerField(blank=True, null=True, default=3)
    label = models.CharField(max_length=255, blank=True, null=True)
    row = models.BooleanField(blank=True, null=True, default=False)
    objects = MongoDBManager()

    class Meta:
        abstract = True
        db_table = 'bpo_report_fields'

    @property
    def to_json(self):
        """Get JSON object."""
        return {
            'id': self.id,
            'label': self.label,
            'value': self.value,
            'type': self.type,
            'size': self.size,
            'label_size': self.label_size,
            'row': self.row
        }


class BPOTable(BPOBaseField):
    """Models for a BPO Table."""
    type = models.CharField(max_length=255, blank=True, null=True, default='table')
    num_rows = models.PositiveIntegerField(blank=True, null=True, default=1)
    num_cols = models.PositiveIntegerField(blank=True, null=True, default=1)
    field_ids = mongodb_fields.ListField(blank=True, null=True)

    @property
    def to_json(self):
        """Get JSON object."""
        basic_info = super(BPOTable, self).to_json
        basic_info['rows'] = self.num_rows
        basic_info['cols'] = self.num_cols
        basic_info['field_ids'] = self.field_ids
        return basic_info


class BPOField(BPOBaseField):
    """Model for a BPO Topic field"""
    FIELD_TYPES = [
        'text_input',
        'date_input',
        'float_input',
        'integer_input',
        'text_area',
        'multiple_choice',
        'radio',
        'math'
    ]
    value = models.CharField(max_length=255, blank=True, null=True)
    type = models.CharField(max_length=255, blank=True, null=True, choices=FIELD_TYPES)
    choices = mongodb_fields.ListField(models.CharField, blank=True, null=True)


class BPOMultipleChoiceField(BPOBaseField):
    """Model for BPO Multiple choice field."""
    value = models.CharField(max_length=255, blank=True, null=True)
    type = models.CharField(max_length=255, blank=True, null=True, default='multiple_choice')
    choices = mongodb_fields.ListField(models.CharField, blank=True, null=True)

    @property
    def to_json(self):
        """Get JSON object."""
        basic_info = super(BPOMultipleChoiceField, self).to_json
        basic_info['choices'] = [str(choice) for choice in self.choices] if self.choices else None
        return basic_info


class BPOTextArea(BPOBaseField):
    """Model for BPO Text Area."""
    value = models.TextField(blank=True, null=True, default='')
    type = models.CharField(max_length=255, blank=True, null=True, default='text_area')


class BPODateField(BPOBaseField):
    """Model for BPO Date field."""
    value = models.DateField(blank=True, null=True)
    type = models.CharField(max_length=255, blank=True, null=True, default='date_input')


class BPOAutoSumField(BPOBaseField):
    """Model for BPO Numeric Field."""
    value = models.FloatField(blank=True, null=True, default=0)
    type = models.CharField(max_length=255, blank=True, null=True, default='auto_sum')
    sub_fields = mongodb_fields.DictField(blank=True, null=True)
    unit = models.CharField(max_length=255, blank=True, null=True)

    @property
    def to_json(self):
        """Get JSON object."""
        basic_info = super(BPOAutoSumField, self).to_json
        basic_info['unit'] = self.unit
        if self.sub_fields:
            basic_info['sub_fields'] = dict()
            for sub_field in self.sub_fields:
                basic_info['sub_fields'][str(sub_field)] = BPOFloatField.objects.get(id=sub_field).value
        return basic_info


class BPOFloatField(BPOBaseField):
    """Model for BPO Numeric Field."""
    value = models.FloatField(blank=True, null=True, default=0)
    type = models.CharField(max_length=255, blank=True, null=True, default='float_input')
    ranges = mongodb_fields.ListField(blank=True, null=True)
    unit = models.CharField(max_length=255, blank=True, null=True)

    @property
    def to_json(self):
        """Get JSON object."""
        basic_info = super(BPOFloatField, self).to_json
        basic_info['ranges'] = self.ranges
        basic_info['unit'] = self.unit
        return basic_info


class BPOIntegerField(BPOBaseField):
    """Model for BPO Numeric Field."""
    value = models.IntegerField(blank=True, null=True, default=0)
    type = models.CharField(max_length=255, blank=True, null=True, default='integer_input')
    ranges = mongodb_fields.ListField(blank=True, null=True)
    unit = models.CharField(max_length=255, blank=True, null=True)

    @property
    def to_json(self):
        """Get JSON object."""
        basic_info = super(BPOIntegerField, self).to_json
        basic_info['ranges'] = self.ranges
        basic_info['unit'] = self.unit
        return basic_info
