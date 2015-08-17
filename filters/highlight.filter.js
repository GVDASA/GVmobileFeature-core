// http://stackoverflow.com/questions/20597286/mark-search-string-dynamically-using-angular-js
/*
  <li ng-repeat="item in data | filter:search.title"
      ng-bind-html="item.title | highlight:search.title">
  </li>
*/
angular.module('core')

.filter('highlight', function($sce) {
  return function(text, phrase) {
    if (phrase) {

      text = '<p>' + text + '</p>';
      phrase = "\\b(\\w*" + phrase.replace(/([{}()[\]\\.?*+^$|=!:~-])/g, "\\$1") + ".?\\w*?)\\b";
      var r = new RegExp(phrase, "igm");

      text = text.replace(/(>[^<]+<)/igm, function(a) {
        return a.replace(r, "<span class='highlighted'>$1</span>");
      });
      text = text.replace(/<p>(.*)<\/p>/igm, '$1');
      // text = text.replace(new RegExp('(' + phrase + ')', 'gi'),'<span class="highlighted">$1</span>')
    }
    return $sce.trustAsHtml(text);
  }
});