# Image Interest Points for LimeSurvey 3.x
**A custom question theme that allows for dropping "positive" and "negative" markers and related comments on an image in LimeSurvey 3.x.**

![Image Interest Points](/interestPoints/survey/questions/answer/multipleshorttext/assets/images/interest_points_1.png)

**Implementation:**

1) Extract the download and upload the **\interestPoints** folder to */pathToLimeSurvey/upload/themes/question/*.

2) Create a multiple-short-text question, click Save.

3) Set the question setting "Question theme" to "interestPoints", click Save.  
![Image Select interestPoints](/interestPoints/survey/questions/answer/multipleshorttext/assets/images/interest_points_2.png)

4) In the question settings "Custom theme options", enter an absolute path to the image, click Save.  
![Image Enter path to image](/interestPoints/survey/questions/answer/multipleshorttext/assets/images/interest_points_3.png)

5) Create 3 times as many subquestions as the number of markers allowed
    - Each marker will populate three sub-questions
    - Marker sign
    - Marker coordinates relative to percentages of width and height of the image
    - The marker comment

6) IMPORTANT: In the survey theme options, set "AJAX mode" to "No".  
![Image Disable AJAX](/interestPoints/survey/questions/answer/multipleshorttext/assets/images/interest_points_4.png)

**Notes:**

1) The styles for the theme can be modified in */pathToLimeSurvey/upload/themes/question/interestPoints/survey/questions/answer/multipleshorttext/assets/css/interestPoints.css*.

2) Demo survey in */interestPoints/survey/questions/answer/multipleshorttext/assets/demo/*.
    
    
*Custom themes are given without any warranty, implied or otherwise.*
