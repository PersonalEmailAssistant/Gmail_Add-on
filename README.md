# Gmail_Add-on

Notes and Known Issues

1.4-Tom (9/16/2021)
- Doodle Poll suggestions now added
- Doodle Poll footer now works properly
- Snooze Button now shows without click on the drop down menu

Known Issues

- The time zone for personalized info is fixed to Perth time zone. (GMT+8)
- The Map Link interface on sidebar is not behave correctly. (Some bottoms do not work: Insert map & Insert link)
- In doodle poll, after input the title, click on next, the page will go from section 1 directly to section 3


1.5-Lily (9/17/2021)
- Timezones now change depending on the user
- All three sections of the doodle poll are visible 

Potential Issue?
- Map link and doodle poll should only be visible when composing an email rather than viewing

1.6-Tom (9/19/2021)
- Cleaning up all the UI code before send them to client(i.e., include but not limit to delete unnecessary code, comments, redundant logic; bug fixes; and improvements)
- redirect 'feedback' link to this page

Potential Issue
- Map link and doodle poll should only be visible when composing an email rather than viewing

1.7-Tom (9/24/2021)
- bug fixes on the map link(allow adding null positon into propertiesService, which crashes the add-on)
- now map link have two seperate interface, one on composing section, the other is sidebar section.
- Combined with the other newest doodle poll changes
- Map link now have 'save location' & 'delete location' buttons visible by default
- Map link will now push notification when user want to use any functions without type something in

Known issue

- If you open MapLink on sidebar first, and then open MapLink on compose again without close the original one, once you close the one on compose and continue using MapLink on sidebar, it will perform compose functions. (the boolean flag used to detect whether on sidebar or composing has been changed)

Workaround

- Push notifications or add warning messages within the app(this might affect the experiences)
- tell the user do not open the same function on both place at the same time
