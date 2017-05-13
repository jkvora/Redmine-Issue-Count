

var matchUrl = 'https://redmine.zeuslearning.com/issues/*';
var matchUrl2 ='https://redmine.zeuslearning.mumbai/issues/*';
var queryInfo = {url: matchUrl};


var issues_type={
    "New" :0,
    "In Progress" : 0,
    "Assigned":0,
    "Reopened":0,
    "Resolved":0,
    "Ready for Tagger":0,
    "Ready for QA":0

}

chrome.tabs.query({ active: true }, function(tabs) {
	var cl = $('#content-list');
	tabs.forEach(function(tab) {
    var urlchk1=new RegExp(matchUrl);
    var urlchk2=new RegExp(matchUrl2);
    var ans=urlchk1.test(tab.url) || urlchk2.test(tab.url);
    if(!ans)
    {
        cl.append('<div class=\"item\">Redime Issue URL not found <br/>(Made  for Internal puropose only)</div>');
        return;
    }
    chrome.tabs.sendMessage(tab.id, {message: 'msg_get_issue_data', tabId: tab.id}, function(response) {
    debugger;
				if (response==null  || response.error) {
					console.log("Error No data found...!!!");
                    cl.append('<div class=\"item\">No data found.<br/>Please open extension on https://redmine.zeuslearning.com/issues/* URL and where issue count is to be done.  <br/<br/>(Made  for Internal puropose only)</div>');
	            }
                else{
                    //Get response data
                    var data=response;

                    //Group it by assigned  
                    var groupedData = _.groupBy(data, 'assigned');
                      
                    //user list 
                    var UserList=Object.keys(groupedData);

                    //initlized Final Object
                    var ans={};
                    for(var i=0;i<UserList.length;i++){
                        ans[UserList[i]]=_.clone(issues_type);
                    }

                    //Fill data 
                    for(var i=0;i<data.length;i++){
                        ans[data[i].assigned][data[i].status]++;
                    }
                    
                    var mapIssuetype = [];

                    //Display data
                    for(var i=0;i<UserList.length;i++)
                    {
                        if(UserList[i]!=null && UserList[i]!="")
                        {
                            var elm="";
                            var iCount = 0;
                            for(var j=0;j<Object.keys(issues_type).length;j++)
                            {
                                var chk=ans[UserList[i]][Object.keys(issues_type)[j]];
                                if( chk> 0)
                                {
                                    if(elm==""){ elm='<ul class=\"item\"><li>'+UserList[i]+' :</li>';}
                                     elm+='<div>'+Object.keys(issues_type)[j]+ " - " + chk +'</div>';
                                 iCount += chk;
                                 curval = mapIssuetype[Object.keys(issues_type)[j]];
                                 curval= curval == undefined? 0 : curval;
                                 mapIssuetype[Object.keys(issues_type)[j]] = curval+ chk;
                                 debugger;
                                }
                                
                            }
                            elm+='</ul>';
                            
                            if(iCount>0){ elm = elm.replace(" :</li>",": "+iCount+"</li>" ); }
                            cl.append(elm);
                        }
                    }
                    var elmtype = "";
                    for(var count = 0; count<Object.keys(mapIssuetype).length; count++)
                    {
                         if( elmtype == "" )
                         {
                             elmtype="<ul class=\"item\">";
                         }
                         if(mapIssuetype[Object.keys(mapIssuetype)[count]]>0)
                         {
                             elmtype+="<li>"+Object.keys(mapIssuetype)[count]+" : "+mapIssuetype[Object.keys(mapIssuetype)[count]]+"</li>";
                         }
                    }
                    elmtype+="</ul>";
                    cl.append(elmtype);
                    //If no issue found
                    if(cl[0].children.length==0)
                    {
                           cl.append('<div class=\"item\">No Pending issue found.</div>');
                    }
                }
         });
    });
})