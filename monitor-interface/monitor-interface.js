Checks = new Meteor.Collection("checks")

if (Meteor.isClient) {

  //To update recency of the last check
  Session.setDefault('currentTime', new Date);
  Template.monitor.onRendered( () => {
    setInterval( () => Session.set('currentTime', new Date) , 1000); // Replace 1000 with your level of time detail
  })

  Template.monitor.helpers({
    lastChecks:  ()  => {
      let checksInfo =  Checks.findOne({}, { sort : { timestamp : -1}})
      //this is just for triggering regular recency updates
      let __lastUpdate =  Session.get('currentTime')
      console.log("updating")
      if(checksInfo) {
        checksInfo.recency =  moment(checksInfo.timestamp).fromNow();
        return checksInfo?checksInfo:null
      } 
    },

    checkClass : () => {
      return Template.currentData().status === "OK" ? "success": "danger"
    }
  });
}