"""View handlers BPO Topic record handler."""
import json
from bson import ObjectId
from django.shortcuts import HttpResponse
from django.http import HttpResponseBadRequest
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_GET, require_POST
from django.views.decorators.csrf import csrf_exempt
from bpo.models.bpo_topic import BPOTopic
from bpo.models.bpo_report import BPOReport
from bpo.utils import topic_utils


@login_required
@require_GET
def get_topic(request):
    """Get a topic given the request."""
    bpo_topic_id = request.GET.get('topic_id')
    if not bpo_topic_id:
        return HttpResponseBadRequest('No Topic Id')
    bpo_topic = BPOTopic.objects.get(id=bpo_topic_id)
    return HttpResponse(json.dumps(bpo_topic.to_json), mimetype="application/x-javascript")


@login_required
@require_GET
def get_topic_list(request):
    """Get list of topics given the request."""
    topic_ids = json.loads(request.GET.get('topic_ids'))
    if not topic_ids:
        return HttpResponseBadRequest(topic_ids)
    topic_ids = [ObjectId(topic_id) for topic_id in topic_ids]
    bpo_topic_list = [BPOTopic.objects.get(id=topic_id).to_json for topic_id in topic_ids]
    return HttpResponse(json.dumps(bpo_topic_list), mimetype="application/x-javascript")


@login_required
@require_POST
@csrf_exempt
def swap_topic(request):
    """Handle a request to swap topic list."""
    try:
        if request.POST.get('root'):
            bpo_topic = BPOReport.objects.get(id=ObjectId(request.POST.get('topic_id')))
        else:
            bpo_topic = BPOTopic.objects.get(id=ObjectId(request.POST.get('topic_id')))
        subtopics = json.loads(request.POST.get('subtopics'))
        assert (len(subtopics) == len(bpo_topic.subtopics))
        bpo_topic.subtopics = [ObjectId(topic_id) for topic_id in subtopics]
        bpo_topic.save()
        bpo_topic_list = [BPOTopic.objects.get(id=topic_id).to_json for topic_id in subtopics]
    except Exception as e:
        return HttpResponseBadRequest(e)
    else:
        return HttpResponse(json.dumps(bpo_topic_list), mimetype="application/x-javascript")


@login_required
@require_POST
@csrf_exempt
def insert_topic(request):
    """Handle a request to insert a topic into topic list."""
    try:
        if request.POST.get('root'):
            bpo_topic = BPOReport.objects.get(id=ObjectId(request.POST.get('topic_id')))
        else:
            bpo_topic = BPOTopic.objects.get(id=ObjectId(request.POST.get('topic_id')))
        insert_topic_id = ObjectId(request.POST.get('insert_topic_id'))
        if not BPOTopic.objects.filter(id=insert_topic_id).exists():
            raise Exception('Not existing topic id %s' % insert_topic_id)
        if insert_topic_id in bpo_topic.subtopics:
            raise Exception('Existed Entry %s' % insert_topic_id)
        bpo_topic.subtopics.insert(0, insert_topic_id)
        bpo_topic.save()
        bpo_topic_list = [BPOTopic.objects.get(id=topic_id).to_json for topic_id in bpo_topic.subtopics]
    except Exception as e:
        return HttpResponseBadRequest(e)
    else:
        return HttpResponse(json.dumps(bpo_topic_list), mimetype="application/x-javascript")


@login_required
@require_POST
@csrf_exempt
def remove_topic(request):
    """Handle a request to remove a topic into topic list."""
    try:
        if request.POST.get('root'):
            bpo_topic = BPOReport.objects.get(id=ObjectId(request.POST.get('topic_id')))
        else:
            bpo_topic = BPOTopic.objects.get(id=ObjectId(request.POST.get('topic_id')))
        remove_topic_id = ObjectId(request.POST.get('remove_topic_id'))
        try:
            bpo_topic.subtopics.remove(remove_topic_id)
        except ValueError:
            raise Exception('Remove topic id does not exists %s' % remove_topic_id)
        bpo_topic.save()
        bpo_topic_list = [BPOTopic.objects.get(id=topic_id).to_json for topic_id in bpo_topic.subtopics]
    except Exception as e:
        return HttpResponseBadRequest(e)
    else:
        return HttpResponse(json.dumps(bpo_topic_list), mimetype="application/x-javascript")


@login_required
@require_POST
@csrf_exempt
def rename_topic(request):
    """Handle a request to remove a topic into topic list."""
    try:
        if BPOReport.objects.filter(id=ObjectId(request.POST.get('topic_id'))).exists():
            bpo_topic = BPOReport.objects.get(id=ObjectId(request.POST.get('topic_id')))
        else:
            bpo_topic = BPOTopic.objects.get(id=ObjectId(request.POST.get('topic_id')))
        try:
            bpo_topic.title = request.POST.get('new_title')
            bpo_topic.save()
        except ValueError:
            raise Exception('Remove topic id does not exists %s' % request.POST.get('topic_id'))
    except Exception as e:
        return HttpResponseBadRequest(e)
    else:
        return HttpResponse(json.dumps({'success': True}), mimetype="application/x-javascript")


@login_required
@require_POST
@csrf_exempt
def delete_topic(request):
    """Handle a request to delete a topic completely."""
    try:
        if request.POST.get('parent_id'):
            if BPOReport.objects.filter(id=ObjectId(request.POST.get('parent_id'))).exists():
                parent_topic = BPOReport.objects.get(id=ObjectId(request.POST.get('parent_id')))
            else:
                parent_topic = BPOTopic.objects.get(id=ObjectId(request.POST.get('parent_id')))
            delete_topic_id = ObjectId(request.POST.get('topic_id'))
            parent_topic.subtopics.remove(delete_topic_id)
            parent_topic.save()
            topic_utils.delete_topic(delete_topic_id)
        else:
            parent_topic = BPOReport.objects.get(id=ObjectId(request.POST.get('topic_id')))
            parent_topic.delete()
    except Exception as e:
        return HttpResponseBadRequest(e)
    else:
        return HttpResponse(json.dumps({'success': True}), mimetype="application/x-javascript")
