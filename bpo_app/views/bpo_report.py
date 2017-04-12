"""View handlers for BPO Reports."""
import json

from bson import ObjectId
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseBadRequest
from django.shortcuts import render_to_response, HttpResponse, redirect
from django.template import RequestContext
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

from bpo.models.bpo_report import BPOReport
from bpo.models.bpo_topic import BPOTopic


@login_required
@require_GET
def index(request):
    """Get list of existing BPO Report."""
    response = dict(
        reports=BPOReport.objects.filter(owner_id=request.user).order_by('-date_created')
    )
    return render_to_response('bpo/index.html',
                              context_instance=RequestContext(request, response))


@login_required
@require_GET
def edit_report(request):
    """Edit a BPO Report template."""
    response = {
        'bpo_report': request.GET.get('report_id')
    }
    return render_to_response('bpo/edit_report.html',
                              context_instance=RequestContext(request, response))


@login_required
@require_GET
def get_report(request):
    """Get a report given the request."""
    try:
        bpo_report_id = ObjectId(request.GET.get('report_id'))
    except Exception as e:
        return HttpResponseBadRequest(e)
    else:
        bpo_report = BPOReport.objects.get(id=bpo_report_id)
        return HttpResponse(json.dumps(bpo_report.to_json), mimetype="application/x-javascript")


@login_required
@require_POST
@csrf_exempt
def create_topic_list(request):
    """Handle a request to create a new topic list."""
    try:
        bpo_report = BPOReport.objects.get(id=ObjectId(request.POST.get('report_id')))
        new_topic_form = BPOTopic(title='New Topic Form', type='topic')
        new_topic_form.save()
        new_topic_list = BPOTopic(
            title=request.POST.get('title'),
            type='topic_list',
            subtopics=[ObjectId(new_topic_form.id)]
        )
        new_topic_list.save()
        if not bpo_report.subtopics:
            bpo_report.subtopics = []
        bpo_report.subtopics.append(ObjectId(new_topic_list.id))
        bpo_report.save()
    except Exception as e:
        return HttpResponseBadRequest(e)
    else:
        return HttpResponse(json.dumps({'success': True}), mimetype="application/x-javascript")


@login_required
@require_POST
@csrf_exempt
def create_topic_form(request):
    """Handle a request to insert a topic into topic list."""
    try:
        bpo_report = BPOReport.objects.get(id=ObjectId(request.POST.get('report_id')))
        new_topic_form = BPOTopic(title=request.POST.get('title'), type='topic')
        new_topic_form.save()
        if not bpo_report.subtopics:
            bpo_report.subtopics = []
        bpo_report.subtopics.append(ObjectId(new_topic_form.id))
        bpo_report.save()
    except Exception as e:
        return HttpResponseBadRequest(e)
    else:
        return HttpResponse(json.dumps({'success': True}), mimetype="application/x-javascript")
