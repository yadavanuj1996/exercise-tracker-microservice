  let changeDateFormat=(dateString)=>{
    let date=new Date(dateString).toUTCString().split(' ');
    date.pop();
    date.pop();
    date[0]=date[0].substring(0,3);
    date=date.join(' ');
    return date;
  }

  exports.changeObjectArrayDateFormat=(objectArray)=>{
    let resultArray=[],i=0;
    for (obj of objectArray){
      let resultObject={...obj};
     
      resultObject=resultObject["_doc"];
      resultObject.date=changeDateFormat(resultObject.date);
      delete resultObject["username"];
      resultArray.push(resultObject);
      i++;
    }
    return resultArray;
  } 
  exports.changeDateFormat=changeDateFormat;
  