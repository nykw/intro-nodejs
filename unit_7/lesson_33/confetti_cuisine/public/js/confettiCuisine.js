$(document).ready(() => {
  const socket = io();

  $("#chatForm").submit(() => {
    const text = $("#chat-input").val();
    const userName = $("#chat-user-name").val();
    const userId = $("#chat-user-id").val();

    socket.emit("message", {
      content: text,
      userName,
      userId
    });

    $("#chat-input").val("");
    return false;
  });

  const getCurrentUserClass = (id) => {
    const userId = $("#chat-user-id").val();
    return (userId === id) ? "current-user" : ""
  };

  const displayMessage = ({ content, user, userName }) => {
    $("#chat").prepend($("<li>").html(`
<div class='message ${getCurrentUserClass(user)}'>
  <span class="user-name">${userName}</span>
${content}
</div>`));
  };

  socket.on("message", (message) => {
    displayMessage(message);

    for (let i = 0; i < 2; i++) {
      $('.chat-icon').fadeOut(200).fadeIn(200);
    }
  });

  socket.on("load all messages", (data) => {
    data.forEach(message => {
      displayMessage(message);
    });
  });

  $("#modal-button").click(() => {
    $(".modal-body").html("");
    $.get(`/api/courses`, (results = {}) => {
      let data = results.data;
      if (!data || !data.courses) return;
      data.courses.forEach(course => {
        $(".modal-body").append(
          `<div>
						<span class="course-title">
							${course.title}
						</span>
						<span class="course-cost">$${course.cost}</span>
						<button class="${course.joined ? "joined-button" : "join-button"} btn btn-info btn-sm" data-id="${course._id}">
							${course.joined ? "Joined" : "Join"}
						</button>
						<div class="course-description">
							${course.description}
						</div>
					</div>`
        );
      });
    }).then(() => {
      addJoinButtonListener();
    });
  });
});

let addJoinButtonListener = () => {
  $(".join-button").click(event => {
    let $button = $(event.target),
      courseId = $button.data("id");
    console.log(`/api/courses/${courseId}/join`)
    $.get(`/api/courses/${courseId}/join`, (results = {}) => {
      let data = results.data;
      if (data && data.success) {
        $button
          .text("Joined")
          .addClass("joined-button")
          .removeClass("join-button");
      } else {
        $button.text("Try again");
      }
    });
  });
};
