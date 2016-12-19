chrome.runtime.onMessage.addListener (
  function(request, sender, sendResponse) {


        var issues=document.getElementsByClassName("list issues");
        if(issues[0]!=null && issues[0].childNodes[0]!=null && issues[0].childNodes[0].childNodes!=null)
        {
                var data=[];
                var result=issues[0].childNodes[0].childNodes;
                for(var i=0;i<result.length;i++){
                    var obj={};
                    obj.status=result[i].childNodes[2].innerHTML;
                    obj.assigned=result[i].childNodes[3].innerHTML==""?"":result[i].childNodes[3].childNodes[0].innerHTML;
                   data.push(obj);    
             }
             sendResponse(data);
        }
        else
        {
            	sendResponse({error: 'Issue data not found...!!!'});
        }
    
  });
	
