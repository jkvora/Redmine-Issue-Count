

var matchUrl = 'https://redmine.zeuslearning.com/issues/*';
var matchUrl2 ='https://redmine.zeuslearning.mumbai/issues/*';
var queryInfo = {url: matchUrl};

debugger;
var issues_type={
    "New" :0,
    "In Progress" : 0,
    "Assigned":0,
    "Reopened":0,
    "Resolved":0,
    "Ready for Tagger":0,
    "Ready for QA":0

}

chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
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

                    //Display data
                    for(var i=0;i<UserList.length;i++)
                    {
                        if(UserList[i]!=null && UserList[i]!="")
                        {
                            var elm="";
                            for(var j=0;j<Object.keys(issues_type).length;j++)
                            {
                                var chk=ans[UserList[i]][Object.keys(issues_type)[j]];
                                if( chk> 0)
                                {
                                    if(elm==""){ elm='<ul class=\"item\"><li>'+UserList[i]+'</li>';}
                                     elm+='<div>'+Object.keys(issues_type)[j]+ " - " + chk +'</div>';
                                }
                                
                            }
                            elm+='</ul>'
                            cl.append(elm);
                        }
                    }
                    //If no issue found
                    if(cl[0].children.length==0)
                    {
                           cl.append('<div class=\"item\">No Pending issue found.</div>');
                    }
                }
         });
    });
})























