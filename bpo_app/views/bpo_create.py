"""View handlers creating a new BPO Report."""
import json
from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response, redirect, HttpResponse
from django.template import RequestContext
from django.views.decorators.http import require_GET
from django.http import HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt

from alsta_assessor.models import AlstaAssessor
from alsta_conveyance.models import AlstaConveyance
from bpo.templates import BPO_TEMPLATES
from bpo.utils import comparable_utils, competitive_utils, verify_utils


@login_required
@csrf_exempt
def create_report(request):
    """Handle a request to create complete new report."""
    if request.method == 'GET':
        # GET Request.
        conveyance_rec = AlstaConveyance.objects.get(id=request.GET.get('conveyance_id'))
        assessment_rec = AlstaAssessor.objects.get(
            parish=conveyance_rec.parish,
            parcel_id=conveyance_rec.parcel_id
        )
        response = {
            'conveyance': conveyance_rec,
            'templates': [bpo_template.TITLE for bpo_template in BPO_TEMPLATES],
            'assessment': assessment_rec
        }
        return render_to_response('bpo/create_report/index.html',
                                  context_instance=RequestContext(request, response))
    else:
        # POST Request.
        bpo_report = None
        try:
            post_request = dict(
                template=request.POST.get('template'),
                title=request.POST.get('title'),
                conveyance_id=request.POST.get('conveyance_id'),
                assessment=json.loads(request.POST.get('assessment')),
                comparables=json.loads(request.POST.get('comparables')),
                competitives=json.loads(request.POST.get('competitives')),
                user=request.user
            )
            verify_utils.save_verified(post_request)
            for bpo_template in BPO_TEMPLATES:
                if bpo_template.TITLE == post_request.get('template'):
                    bpo_report = bpo_template.create(post_request)
            if not bpo_report:
                raise Exception('No Template matched')
        except Exception as e:
            return HttpResponseBadRequest(e)
        else:
            response = {
                'success': True,
                'report_id': bpo_report.id,
                'redirect_url': '/bpo/edit_report?report_id=%s' % bpo_report.id
            }
            return HttpResponse(json.dumps(response), mimetype="application/x-javascript")


@login_required
@require_GET
def verify_property(request):
    """Handle a verifying property query information."""
    conveyance_rec = AlstaConveyance.objects.get(id=request.GET.get('conveyance_id'))
    assessment_rec = AlstaAssessor.objects.get(
        parish=conveyance_rec.parish,
        parcel_id=conveyance_rec.parcel_id
    )
    return render_to_response('bpo/create_report/verify_property/index.html',
                              context_instance=RequestContext(request, assessment_rec))


@login_required
@require_GET
def get_comparables(request):
    """Get comparable sales given the conveyance."""
    conveyance_rec = AlstaConveyance.objects.get(id=request.GET.get('conveyance_id'))
    comparables = comparable_utils.GetComparables(conveyance_rec)
    return HttpResponse(json.dumps(comparables), mimetype="application/x-javascript")


@login_required
@require_GET
def get_competitives(request):
    """Get competitive listings given the conveyance."""
    conveyance_rec = AlstaConveyance.objects.get(id=request.GET.get('conveyance_id'))
    competitive_listings = competitive_utils.GetCompetitiveListings(conveyance_rec)
    return HttpResponse(json.dumps(competitive_listings), mimetype="application/x-javascript")
