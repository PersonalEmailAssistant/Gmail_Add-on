# Robbie - Personal Email Assistant Add-On

<h3>Program Overview</h3>

Robbie is a Gmail add-on that streamlines everyday email processes. 

The add-on has 3 main functions:

- Snooze Emails 
- Map Link
- Doodle Poll


<h3>Snooze Emails</h3>

The <b>'Snooze Email'</b> function enables user to snooze an email for a designated time or for a specific date. The 'Snooze' feature helps you to stay on top of your inbox, by sending a reminder to follow up an email that at the time, you weren't able to respond to. Robbie also adds a folder in the Gmail sidebar, which automatically stores Snoozed emails. 
  
  To snooze an email, you'll need to:
  
   1. Click on the <b>'Robbie'</b> icon in the right-hand side menu.
   2. Select the <b>'Snooze'</b> button (Note: The 'Snooze' button will only appear when an email is open). 
   3. Insert other stuff
   4. The Snoozed email will be added to a specified folder, from here you may wish to search through other Snoozed emails.
   5. When the specified time has been reached, the email will reappear at the top of your Inbox. 
  

<h3>Map Link</h3>

The <b>'Map Link' </b>function enables users to share a location, directions, or a map and attach it to an email. The 'Map Link' function streamlines the process of setting a meeting location and enables users to easily locate a meeting. 
  
  To insert a Map Link, you'll need to:
  
   1. Click on the <b>'Robbie'</b> icon in the right-hand side menu.
   2. Select <b>'Map Link'</b>.
   4. Under <b>'Location'</b>, insert the name of the Location. For example, UWA. 
   5. Under <b>'Latitude and Longitude'</b>, insert the coordinates for the specified location. 
      *Optional: To save the location for easy access, under 'Show Map Link' select <b>'Save Location'</b>.
   6. To send a link for Google Maps, select <b>'Show Map Link'</b>.
   7. To send a static map as an image, select <b>'Show Static Map'</b>
   8. From here, select the link or the photo, and copy and paste the information into your email. 
  
  
<h3>Doodle Poll</h3>

The <b>'Doodle Poll'</b> function enables users to create a Poll which allows recipients to vote and easily manage events and details. 

  To create a Doodle Poll, you'll need to:
  
   1. Click on the <b>'Robbie'</b> icon in the right-hand side menu.
   2. Select the <b>'Doodle Poll'</b> button.
   
  *General Information*
  
   4. Insert a title for the meeting or activity.
   5. Under <b>'Length of Meeting'</b>, insert the designated time of the meeting. Note: The length must be set in minutes. For example, a 1.5-hour meeting is           '90'. 
   6. *Optional: You may wish to add a note in the <b>'Notes'</b> section.
   7. Under the 'Location' tab, select the desired location.
   8. Select <b>'Next'</b>.

*Scheduling Options*

   10. From here, to insert your poll options select either <b>'Date Options'</b> or <b>'Text Options'</b>. 
   11. To add more options, select <b>'Add Option to Poll'</b>. 
   12. Select <b>'Next'</b>.

*Poll Settings*

   14. From here, select all the settings that apply.
   15. Select <b>'Complete Poll'</b>. 
   16. A link will then be created. Copy and paste this link into your email.
   17. When a response has been received, you will receive an email providing you with the recipient’s responses.  
   18. You can also review recipient’s responses by opening the 'Robbie' menu and selecting <b>'Doddle Poll'</b>. 
   19. Under <b>'View Poll Results'</b>, click the link. 

 *Close Poll*
 
   20. Once a time has been confirmed, to close the poll click the relevant date or text option. 
   21. Add the email addresses of the desired recipients. 
   22. Under 'Location', insert the location of the meeting. 
   23. Select <b>'Confirm Meeting and Close Poll'</b>. 




MIT License

Copyright (c) [2021]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.



Notes and Known Issues

1.4-Tom (9/16/2021)
- Doodle Poll suggestions now added
- Doodle Poll footer now works properly
- Snooze Button now shows without click on the drop-down menu

Known Issues

- The time zone for personalized info is fixed to Perth time zone. (GMT+8)
- The Map Link interface on sidebar is not behave correctly. (Some bottoms do not work: Insert map & Insert link)
- In doodle poll, after input the title, click on next, the page will go from section 1 directly to section 3


1.5-Lily (9/17/2021)
- Time zones now change depending on the user
- All three sections of the doodle poll are visible 

Potential Issue?
- Map link and doodle poll should only be visible when composing an email rather than viewing

1.6-Tom (9/19/2021)
- Cleaning up all the UI code before sending them to client (i.e., include but not limit to delete unnecessary code, comments, redundant logic; bug fixes; and improvements)
- redirect 'feedback' link to this page

Potential Issue
- Map link and doodle poll should only be visible when composing an email rather than viewing

1.7-Tom (9/24/2021)
- bug fixes on the map link (allow adding null position into propertiesService, which crashes the add-on)
- now map link have two separate interfaces, one on composing section, the other is sidebar section.
- Combined with the other newest doodle poll changes
- Map link now have 'save location' & 'delete location' buttons visible by default
- Map link will now push notification when user want to use any functions without type something in

Known issue

- If you open MapLink on sidebar first, and then open MapLink on compose again without close the original one, once you close the one on compose and continue using MapLink on sidebar, it will perform compose functions. (The boolean flag used to detect whether on sidebar or composing has been changed)

Workaround

- Push notifications or add warning messages within the app (this might affect the experiences)
- tell the user do not open the same function on both place at the same time
![image](https://user-images.githubusercontent.com/54531464/136403583-c63db009-ae0e-43ef-9929-864fc334ec04.png)
