"""View handlers BPO Field record handler."""
import json

from bson import ObjectId
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseBadRequest
from django.shortcuts import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

from bpo.models.bpo_field import *
from bpo.models.bpo_topic import BPOTopic


def _GetField(bpo_field_id):
    """
    Get Field given its model type.
    :param request:
    :return:
    """
    bpo_field = BPOField.objects.get(id=bpo_field_id)
    # Get BPO Field based on type.
    if bpo_field.type == 'auto_sum':
        return BPOAutoSumField.objects.get(id=bpo_field_id)
    elif bpo_field.type == 'multiple_choice':
        return BPOMultipleChoiceField.objects.get(id=bpo_field_id)
    elif bpo_field.type == 'float_input':
        return BPOFloatField.objects.get(id=bpo_field_id)
    elif bpo_field.type == 'integer_input':
        return BPOIntegerField.objects.get(id=bpo_field_id)
    elif bpo_field.type == 'date_input':
        return BPODateField.objects.get(id=bpo_field_id)
    elif bpo_field.type == 'table':
        return BPOTable.objects.get(id=bpo_field_id)
    else:
        return bpo_field


@login_required
@require_GET
def get_field(request):
    """Get a field given the request."""
    try:
        bpo_field_id = request.GET.get('field_id')
        bpo_field = _GetField(bpo_field_id)
    except Exception as e:
        return HttpResponseBadRequest(e)
    else:
        return HttpResponse(json.dumps(bpo_field.to_json), mimetype="application/x-javascript")


@login_required
@require_GET
def get_table(request):
    """Get a table given the request."""
    try:
        bpo_table_id = request.GET.get('table_id')
        bpo_table = _GetField(bpo_table_id)
    except Exception as e:
        return HttpResponseBadRequest(e)
    else:
        return HttpResponse(json.dumps(bpo_table.to_json), mimetype="application/x-javascript")


@login_required
@csrf_exempt
@require_POST
def add_field(request):
    """Add a new field given the request."""
    try:
        bpo_topic = BPOTopic.objects.get(id=ObjectId(request.POST.get('topic_id')))
    except Exception as e:
        return HttpResponseBadRequest(e)
    else:
        input_type = request.POST.get('type')
        input_label = request.POST.get('label')
        if input_type == 'date_input':
            bpo_field = BPODateField(
                label=input_label,
                type=input_type,
            )
        elif input_type == 'number_input':
            bpo_field = BPOFloatField(
                label=input_label,
                type=input_type
            )
        elif input_type == 'auto_sum':
            bpo_field = BPOAutoSumField(
                label=input_label,
                type=input_type,
                sub_fields={}
            )
        elif input_type == 'multiple_choice':
            bpo_field = BPOMultipleChoiceField(
                label=input_label,
                type=input_type,
                choices=['New Choice 1', 'New Choice 2']
            )
        else:
            bpo_field = BPOField(
                label=input_label,
                type=input_type,
            )
        bpo_field.save()
        bpo_field_id = ObjectId(bpo_field.id)
        if not bpo_topic.fields:
            bpo_topic.fields = [bpo_field_id]
        else:
            bpo_topic.fields.append(bpo_field_id)
        bpo_topic.save()
        return HttpResponse(json.dumps(bpo_field.to_json), mimetype="application/x-javascript")


@login_required
@require_POST
@csrf_exempt
def delete_field(request):
    """Delete a field given the request."""
    try:
        bpo_topic = BPOTopic.objects.get(id=ObjectId(request.POST.get('topic_id')))
        bpo_field = BPOField.objects.get(id=ObjectId(request.POST.get('field_id')))
        bpo_topic.fields.remove(ObjectId(bpo_field.id))
        bpo_topic.save()
        bpo_field.delete()
    except Exception as e:
        return HttpResponseBadRequest(e)
    else:
        return HttpResponse(json.dumps({'status': 'success'}), mimetype="application/x-javascript")


@login_required
@require_POST
@csrf_exempt
def save_field(request):
    """
    Save a field given the request.
    Note that all field models save on the same collection.
    :param request:
    :return:
    """
    try:
        # Get BPO Field based on type.
        bpo_field_id = request.POST.get('field_id')
        bpo_field = _GetField(bpo_field_id)
        # Assign new value.
        if request.POST.get('value'):
            bpo_field.value = request.POST.get('value')
        if request.POST.get('label'):
            bpo_field.label = request.POST.get('label')
        if request.POST.get('sub_fields'):
            bpo_field.sub_fields = json.loads(request.POST.get('sub_fields'))
        if request.POST.get('size'):
            new_size = int(request.POST.get('size'))
            if BPOField.SIZE_RANGE[0] <= new_size <= BPOField.SIZE_RANGE[1]:
                bpo_field.size = new_size
        if request.POST.get('label_size'):
            new_size = int(request.POST.get('label_size'))
            if BPOField.SIZE_RANGE[0] <= new_size <= BPOField.SIZE_RANGE[1]:
                bpo_field.label_size = new_size
        # Save object.
        bpo_field.save()
    except Exception as e:
        return HttpResponseBadRequest(e)
    else:
        return HttpResponse(json.dumps({'status': 'success'}), mimetype="application/x-javascript")


@login_required
@require_POST
@csrf_exempt
def edit_choice(request):
    """Add a new choice to multiple choice field given the request."""
    try:
        bpo_field = BPOField.objects.get(id=ObjectId(request.POST.get('field_id')))
        if request.POST.get('action') == 'edit':
            if request.POST.get('choice') and request.POST.get('choice_index'):
                choice_index = int(request.POST.get('choice_index'))
                bpo_field.choices[choice_index] = request.POST.get('choice')
        elif request.POST.get('action') == 'add':
            if not bpo_field.choices:
                bpo_field.choices = []
            bpo_field.choices.append(request.POST.get('choice'))
        elif request.POST.get('action') == 'delete':
            bpo_field.choices.remove(request.POST.get('choice'))
        bpo_field.save()
    except Exception as e:
        return HttpResponseBadRequest(e)
    else:
        return HttpResponse(json.dumps({'status': 'success'}), mimetype="application/x-javascript")
