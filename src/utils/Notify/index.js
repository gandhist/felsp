export const notify = ({place, message, color}) => {
    var options = {};
    options = {
      place: place,
      message: (
        <div>
          <div>
            {message}
          </div>
        </div>
      ),
      type: color,
      icon: "nc-icon nc-bell-55",
      autoDismiss: 7,
    };
    notificationAlertRef.current.notificationAlert(options);
  };