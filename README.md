Penplate
========

A jQuery based HTML5 Editor for quick easy inline text editing.


Getting Started
========

To get Penplate working include the following files in your porject.

```
<head>
	<!--Required javascript-->
    <script src="js/min/jquery-v-1.11.0.min.js" type="text/javascript"></script>

    <!--Penplate-->
    <script src="js/min/penplate.min.js" type="text/javascript"></script>
	<link href="css/penplate.css" rel="stylesheet" type="text/css">
</head>
```

Once included, call Penplate by referencing the containing class in your javascript file. Penplate will automatically assign the contenteditable attribute if need be.

Javascript call:

```
$(document).ready(function()
{
	$('.penplate-example').penplate();
});

Example HTML:

```
<div class="penplate-example">
	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec quis mauris mi. Quisque sodales vel orci eu consequat. Morbi lacinia, ligula sit amet commodo interdum, ligula tortor rhoncus elit, quis pretium orci nunc nec nisi.
</div>
```


Copyright and License
========

Copyright 2014 Savedge Project

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.