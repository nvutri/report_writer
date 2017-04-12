from django.conf.urls import patterns, url
from django.views.decorators.cache import never_cache
from bpo.views import bpo_report as report_views
from bpo.views import bpo_topic as topic_views
from bpo.views import bpo_field as field_views
from bpo.views import bpo_create as report_create

# BPO Report patterns.
urlpatterns = patterns(
    '',
    url(r'^$', never_cache(report_views.index), name='bpo_index'),
    url(r'^create_report/', never_cache(report_create.create_report), name='bpo_create'),
    url(r'^edit_report', never_cache(report_views.edit_report), name='bpo_edit'),
    url(r'^bpo_report/get_report/$', never_cache(report_views.get_report)),
    url(r'^bpo_report/create_topic_list/$', never_cache(report_views.create_topic_list)),
    url(r'^bpo_report/create_topic_form/$', never_cache(report_views.create_topic_form)),
)

# BPO Topic patterns.
urlpatterns += patterns(
    '',
    url(r'^bpo_topic/delete_topic/$', never_cache(topic_views.delete_topic)),
    url(r'^bpo_topic/get_topic/$', never_cache(topic_views.get_topic)),
    url(r'^bpo_topic/get_topic_list/$', never_cache(topic_views.get_topic_list)),
    url(r'^bpo_topic/swap_topic/$', never_cache(topic_views.swap_topic)),
    url(r'^bpo_topic/insert_topic/$', never_cache(topic_views.insert_topic)),
    url(r'^bpo_topic/remove_topic/$', never_cache(topic_views.remove_topic)),
    url(r'^bpo_topic/rename_topic/$', never_cache(topic_views.rename_topic)),
)

# BPO Topic Field patterns.
urlpatterns += patterns(
    '',
    url(r'^bpo_field/add_field/$', never_cache(field_views.add_field)),
    url(r'^bpo_field/delete_field/$', never_cache(field_views.delete_field)),
    url(r'^bpo_field/edit_choice/$', never_cache(field_views.edit_choice)),
    url(r'^bpo_field/get_field/$', never_cache(field_views.get_field)),
    url(r'^bpo_field/save_field/$', never_cache(field_views.save_field)),
    url(r'^bpo_field/get_table/$', never_cache(field_views.get_table)),
)
