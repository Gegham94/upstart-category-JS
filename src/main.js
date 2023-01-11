const autocompleteApi = "https://upstart.brainfors.am/api/v1/autocompletes/";
const searchApi = "https://upstart.brainfors.am/api/v1/search?";
const categoryApi = "https://upstart.brainfors.am/api/v1/categories";
const levelApi = "https://upstart.brainfors.am/api/v1/course-levels";
const typelApi = "https://upstart.brainfors.am/api/v1/course-types";
const languageApi = "https://upstart.brainfors.am/api/v1/get-languages";

let categoryArr = [];
let levelArr = [];
let typeArr = [];
let languageArr = [];

let filterQueryParam = "";
let sortQueryParam = "";

let courses;

let loaderContent = document.getElementById("coursesTableContainer");
loaderContent.setAttribute("class", "loading");

let paginator = document.getElementById("paginator");
paginator.style.visibility = "hidden";

res = document.getElementById("result");
let searchInput = document.getElementById("search_input");
searchInput.addEventListener("focus", (event) => {
  event.stopPropagation();
  res.style.display = "block";
  res.style.height = "auto";
});
searchInput.addEventListener("click", (event) => {
  event.stopPropagation();
  res.style.display = "block";
  res.style.height = "auto";
  event.stopPropagation();
});

let searchCloseIcon = document.getElementById("search_close_icon");
searchCloseIcon.style.display = "none";

function showResults(val, bool) {
  if (!bool) {
    searchInput.value = "";
    $.get(searchApi, function (data, status) {
      if (status === "success") {
        displayCourse(data);
      }
    });
  }
  res.innerHTML = "";
  res.style.paddingLeft = "5px";
  res.style.paddingBottom = "5px";
  res.style.border = "1px solid #ccc";
  res.style.display = "block";
  if (val == "" || val.length < 3) {
    res.style.display = "none";
    searchCloseIcon.style.display = "none";
    return false;
  }
  let autocomList = document.createElement("ul");
  searchCloseIcon.style.display = "block";
  $.get(autocompleteApi + val, function (data, status) {
    if (status === "success") {
      res.style.paddingLeft = "5px";
      res.style.paddingBottom = "5px";
      res.style.border = "1px solid #ccc";
      res.style.display = "block";
      if (data.courses.length > 0) {
        for (i = 0; i < data.courses.length; i++) {
          let imgLi = document.createElement("li");
          imgLi.style.display = "flex";
          imgLi.style.flexDirection = "row";
          imgLi.style.alignItems = "center";
          let img = document.createElement("img");
          img.style.width = "25px";
          img.style.height = "25px";
          img.style.marginRight = "5px";
          img.setAttribute("src", data.courses[i].cover_image);
          imgLi.appendChild(img);
          let titlesDiv = document.createElement("div");
          titlesDiv.style.display = "flex";
          titlesDiv.style.flexDirection = "column";
          let titleCourse = document.createElement("span");
          titleCourse.innerText = data.courses[i].title;
          let trainerCourse = document.createElement("span");
          trainerCourse.style.fontSize = "12px";
          trainerCourse.innerText = data.courses[i].trainer_name;
          titlesDiv.appendChild(titleCourse);
          titlesDiv.appendChild(trainerCourse);
          imgLi.appendChild(titlesDiv);
          imgLi.addEventListener("click", () => {
            searchByTextFunc(titleCourse.innerText, res);
          });
          autocomList.appendChild(imgLi);
        }
      }
      for (i = 0; i < data.text.length; i++) {
        let list = document.createElement("li");
        let titleSpan = document.createElement("span");
        titleSpan.innerText = data.text[i];
        list.appendChild(titleSpan);
        list.addEventListener("click", () => {
          searchByTextFunc(titleSpan.innerText, res);
        });
        autocomList.appendChild(list);
      }
    } else {
      res.innerHTML = "";
      let empty =
        '<li style="list-style-type: none;font-style: italic; color: gray;margin-top:5px">Courses not found !</li>';
      res.innerHTML = empty;
      return;
    }
    res.appendChild(autocomList);
  });
}

$(document).ready(function () {
  $.get(searchApi, function (data, status) {
    if (status === "success") {
      displayCourse(data);
    }
  });
  $.get(categoryApi, function (data, status) {
    if (status === "success") {
      let el;
      let cEl;
      let topicBody = document.createElement('div');
      topicBody.setAttribute('id', 'topic_body');
      let topicChildBody;
      function renderParentList(element) {
        let li = document.createElement("li");
        li.setAttribute("class", "item");
        let label = document.createElement("label");
        let input = document.createElement("input");
        input.setAttribute("class", "checkboxItem");
        input.setAttribute("type", "checkbox");
        input.setAttribute("value", element.id);
        input.addEventListener("change", (event) => {
          if (event.currentTarget.checked) {
            if (element.children.length > 0) {
              element.children.forEach((item) => {
                categoryArr.push(item.id);
              });
            } else {
              categoryArr.push(event.target.value);
            }
          } else {
            categoryArr = [];
          }
          filter();
        });
        let titleSpan = document.createElement("span");
        titleSpan.innerText = element.title;
        let topicChildI = document.createElement("i");
        topicChildI.setAttribute('class', 'fa fa-angle-up');
        topicChildI.setAttribute('id', `child_topic_arrow${element.id}`);
        label.appendChild(input);
        label.appendChild(titleSpan);
        li.appendChild(label);
        el = li;
        topicBody.appendChild(el);
        if (element.children.length > 0) {
          label.appendChild(topicChildI);
          let topicChildBody = document.createElement('div');
          element.children.forEach((childElement) => {
            topicChildBody.setAttribute('id', `child_topic_body${childElement.id}`);
            topicChildI.addEventListener("click", (event) => {
              event.stopPropagation();
              collapse(`child_topic_arrow${element.id}`, `child_topic_body${childElement.id}`)
            });
            let li = document.createElement("li");
            li.setAttribute("class", "childItem");
            let label = document.createElement("label");
            let input = document.createElement("input");
            input.setAttribute("class", "childCheckboxItem");
            input.setAttribute("type", "checkbox");
            input.setAttribute("value", childElement.id);
            input.addEventListener("change", (event) => {
              if (event.currentTarget.checked) {
                categoryArr.push(event.target.value);
              } else {
                categoryArr = categoryArr.filter((e) => e !== event.target.value);
              }
              filter();
            });
            let titleSpan = document.createElement("span");
            titleSpan.innerText = childElement.title;
            label.appendChild(input);
            label.appendChild(titleSpan);
            li.appendChild(label);
            topicChildBody.appendChild(li);
            cEl = topicChildBody;
            el.appendChild(cEl);
          });
        }
        document.getElementById("topicList").appendChild(topicBody);
      }
      data.forEach(renderParentList);
    }
  });
  $.get(levelApi, function (data, status) {
    if (status === "success") {
      let li;
      let levelBody = document.createElement('div');
      levelBody.setAttribute('id', 'level_body');
      function renderList(element) {
        if (element[1] !== 1) {
          li = document.createElement("li");
          li.setAttribute("class", "item");
          let titleSpan = document.createElement("span");
          titleSpan.innerText = element[0];
          let label = document.createElement("label");
          let input = document.createElement("input");
          input.setAttribute("class", "checkboxItem");
          input.setAttribute("type", "checkbox");
          input.setAttribute("value", element[1]);
          input.addEventListener("change", (event) => {
            if (event.currentTarget.checked) {
              levelArr.push(event.target.value);
            } else {
              levelArr = levelArr.filter((e) => e !== event.target.value);
            }
            filter();
          });
          label.appendChild(input);
          label.appendChild(titleSpan);
          li.appendChild(label);
          levelBody.appendChild(li);
          levelBody.style.display = 'none';
          document.getElementById("levelList").appendChild(levelBody);
        }
      }
      Object.entries(data).forEach(renderList);
    }
  });
  $.get(typelApi, function (data, status) {
    if (status === "success") {
      let li;
      let typeBody = document.createElement('div');
      typeBody.setAttribute('id', 'type_body');
      function renderList(element) {
        li = document.createElement("li");
        li.setAttribute("class", "item");
        let titleSpan = document.createElement("span");
        titleSpan.innerText = element[0];
        let label = document.createElement("label");
        let input = document.createElement("input");
        input.setAttribute("class", "checkboxItem");
        input.setAttribute("type", "checkbox");
        input.setAttribute("value", element[1]);
        input.addEventListener("change", (event) => {
          if (event.currentTarget.checked) {
            typeArr.push(event.target.value);
          } else {
            typeArr = typeArr.filter((e) => e !== event.target.value);
          }
          filter();
        });
        label.appendChild(input);
        label.appendChild(titleSpan);
        li.appendChild(label);
        typeBody.appendChild(li);
        typeBody.style.display = 'none';
        document.getElementById("typeList").appendChild(typeBody);
      }
      Object.entries(data).forEach(renderList);
    }
  });
  $.get(languageApi, function (data, status) {
    if (status === "success") {
      let li;
      let languageBody = document.createElement('div');
      languageBody.setAttribute('id', 'language_body');
      function renderParentList(element) {
        li = document.createElement("li");
        li.setAttribute("class", "item");
        let titleSpan = document.createElement("span");
        titleSpan.innerText = element.title;
        let label = document.createElement("label");
        let input = document.createElement("input");
        input.setAttribute("class", "checkboxItem");
        input.setAttribute("type", "checkbox");
        input.setAttribute("value", element.id);
        input.addEventListener("change", (event) => {
          if (event.currentTarget.checked) {
            languageArr.push(event.target.value);
          } else {
            languageArr = languageArr.filter((e) => e !== event.target.value);
          }
          filter();
        });
        label.appendChild(input);
        label.appendChild(titleSpan);
        li.appendChild(label);
        languageBody.appendChild(li);
        languageBody.style.display = 'none';
        document.getElementById("languageList").appendChild(languageBody);
      }
      data.forEach(renderParentList);
    }
  });
});
function collapse(selectedArrowId, collapsedBodyId){
  let selectedArrow = document.getElementById(selectedArrowId);
  let togList = document.getElementById(collapsedBodyId);
  switch (selectedArrow.classList.contains('fa-angle-down')){
    case true:
      selectedArrow.classList.remove('fa-angle-down');
      selectedArrow.classList.add('fa-angle-up');
      togList.style.display = 'block';
      break;
    case false:
      selectedArrow.classList.remove('fa-angle-up');
      selectedArrow.classList.add('fa-angle-down');
      togList.style.display = 'none';
      break;
  }
}

function searchByTextFunc(searchText, res) {
  res.style.paddingLeft = "0px";
  res.style.paddingBottom = "0px";
  res.style.border = "none";
  res.style.display = "none";
  res.style.height = "0px";
  $.get(searchApi + `search_text=${searchText}`, function (data, status) {
    if (status === "success") {
      displayCourse(data);
    }
  });
}

function filter() {
  loaderContent.innerHTML = "";
  loaderContent.setAttribute("class", "loading");
  paginator.style.visibility = "hidden";
  filterQueryParam = "";
  let params = {
      categories: categoryArr.join(),
      level: levelArr.join(),
      type: typeArr.join(),
      language_id: languageArr.join(),
    },
    queryParam = encodeQuery(params);
  filterQueryParam = queryParam;
  if (sortQueryParam !== "") {
    url = searchApi + filterQueryParam + "&" + sortQueryParam;
  } else {
    url = searchApi + filterQueryParam;
  }
  $.get(url, function (data, status) {
    if (status === "success") {
      displayCourse(data);
    }
  });
}

// SORT FILTER ------------------------------
$(".custom-select").each(function () {
  var classes = $(this).attr("class"),
    id = $(this).attr("id"),
    name = $(this).attr("name");
  var template = '<div class="' + classes + '">';
  template +=
    '<span class="custom-select-trigger">' +
    $(this).attr("placeholder") +
    "</span>";
  template += '<div class="custom-options">';
  $(this)
    .find("option")
    .each(function () {
      template +=
        '<span class="custom-option ' +
        $(this).attr("class") +
        '" data-value="' +
        $(this).attr("value") +
        '">' +
        $(this).html() +
        "</span>";
    });
  template += "</div></div>";

  $(this).wrap('<div class="custom-select-wrapper"></div>');
  $(this).hide();
  $(this).after(template);
});
$(".custom-option:first-of-type").hover(
  function () {
    $(this).parents(".custom-options").addClass("option-hover");
  },
  function () {
    $(this).parents(".custom-options").removeClass("option-hover");
  }
);
$(".custom-select-trigger").on("click", function () {
  $("html").one("click", function () {
    $(".custom-select").removeClass("opened");
  });
  $(this).parents(".custom-select").toggleClass("opened");
  event.stopPropagation();
});
$(".custom-option").on("click", function (event) {
  sort(event.target.getAttribute('data-value'))
  $(this)
    .parents(".custom-select-wrapper")
    .find("select")
    .val($(this).data("value"));
  $(this)
    .parents(".custom-options")
    .find(".custom-option")
    .removeClass("selection");
  $(this).addClass("selection");
  $(this).parents(".custom-select").removeClass("opened");
  $(this)
    .parents(".custom-select")
    .find(".custom-select-trigger")
    .text($(this).text());
});
function sort(value) {
  loaderContent.innerHTML = "";
  loaderContent.setAttribute("class", "loading");
  paginator.style.visibility = "hidden";
  sortQueryParam = "";
  let params = {
    sort: value,
  };
  queryParam = encodeQuery(params);
  sortQueryParam = queryParam;
  let url = "";
  if (filterQueryParam !== "") {
    url = searchApi + filterQueryParam + "&" + sortQueryParam;
  } else {
    url = searchApi + sortQueryParam;
  }
  $.get(url, function (data, status) {
    if (status === "success") {
      displayCourse(data);
    }
  });
}
function displayCourse(data) {
  loaderContent.removeAttribute("class");
  paginator.style.visibility = "visible";
  if (data.data.length > 0) {
    data.data.forEach((element) => {
      loaderContent = document.getElementById("data-content");

      let courseDiv = document.createElement("li");
      courseDiv.setAttribute("class", "course");

      let image = document.createElement("img");
      image.setAttribute("class", "course_image");
      image.setAttribute("src", element.cover_image);
      courseDiv.appendChild(image);

      let courseInfo = document.createElement("div");
      courseInfo.setAttribute("class", "course_info");
      let leftInfo = document.createElement("div");
      leftInfo.setAttribute("class", "left_info");

      let title = document.createElement("span");
      title.style.marginBottom = "5px";
      title.style.color = "#6b63dd";
      title.innerText = element.category_title;
      let parentTitle = document.createElement("span");
      parentTitle.style.marginBottom = "5px";
      parentTitle.style.color = "gray";
      parentTitle.innerText = element.parent_category_title;
      let subTitle = document.createElement("span");
      subTitle.style.marginBottom = "5px";
      subTitle.style.color = "gray";
      subTitle.innerText = element.sub_title;
      leftInfo.appendChild(title);
      leftInfo.appendChild(parentTitle);
      leftInfo.appendChild(subTitle);

      let rateDateStatus = document.createElement("div");
      rateDateStatus.setAttribute("class", "rate_part");

      let rate = document.createElement("span");
      rate.style.marginRight = "20px";
      rate.innerText = element.rating;

      let date = document.createElement("span");
      date.style.marginRight = "20px";
      let dateValue = document.createElement("span");
      dateValue.innerText = element.created_at;
      date.appendChild(dateValue);

      let user = document.createElement("span");
      user.setAttribute("class", "avatar_part");
      let trainer = document.createElement("img");
      trainer.setAttribute("class", "trainer_avatar");
      trainer.setAttribute("src", element.trainer_avatar);
      let trainerName = document.createElement("span");
      trainerName.innerText = element.trainer_name;
      user.appendChild(trainer);
      user.appendChild(trainerName);

      rateDateStatus.appendChild(rate);
      rateDateStatus.appendChild(date);
      rateDateStatus.appendChild(user);
      leftInfo.appendChild(rateDateStatus);

      let rightInfo = document.createElement("div");
      rightInfo.setAttribute("class", "right_info");

      let price = document.createElement("span");
      price.style.color = "#13013f";
      price.innerText = element.price;
      let card = document.createElement("span");
      card.style.color = "#6b63dd";
      card.innerText = "Add to card";
      let wishlist = document.createElement("span");
      wishlist.style.color = "#6b63dd";
      wishlist.innerText = "Add to wishlist";

      rightInfo.appendChild(price);
      rightInfo.appendChild(card);
      rightInfo.appendChild(wishlist);

      courseInfo.appendChild(leftInfo);
      courseInfo.appendChild(rightInfo);

      courseDiv.appendChild(courseInfo);
      loaderContent.appendChild(courseDiv);
    });
    courses = data.data;
    changePage(1, data.data);
    let paginator = document.getElementById("paginator");
    paginator.style.visibility = "visible";
  } else {
    loaderContent.innerHTML = "";
    let noDataTitle = document.createElement("h2");
    noDataTitle.style.marginTop = "200px";
    noDataTitle.innerText = "Course Not Found !";
    loaderContent.appendChild(noDataTitle);
    let paginator = document.getElementById("paginator");
    paginator.style.visibility = "hidden";
  }
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
}
function encodeQuery(params) {
  let query = "";
  for (let d in params)
    query += encodeURIComponent(d) + "=" + encodeURIComponent(params[d]) + "&";
  return query.slice(0, -1);
}

var current_page = 1;
var records_per_page = 5;

function prevPage() {
  if (current_page > 1) {
    current_page--;
    changePage(current_page);
  }
}

function nextPage() {
  if (current_page < numPages()) {
    current_page++;
    changePage(current_page);
  }
}
function changePage(page, coursesData) {
  if (coursesData !== undefined) courses = coursesData;
  var btn_next = document.getElementById("btn_next");
  var btn_prev = document.getElementById("btn_prev");
  btn_prev.style.opacity = "0.5";
  btn_prev.style.pointerEvents = "none";
  var listing_table = document.getElementById("data-content");
  var page_span = document.getElementById("page");

  // Validate page
  if (page < 1) page = 1;
  if (page > numPages()) page = numPages();

  listing_table.innerHTML = "";

  for (
    var i = (page - 1) * records_per_page;
    i < page * records_per_page && i < courses.length;
    i++
  ) {
    listing_table = document.getElementById("data-content");

    let courseDiv = document.createElement("li");
    courseDiv.setAttribute("class", "course");

    let image = document.createElement("img");
    image.setAttribute("class", "course_image");
    image.setAttribute("src", courses[i].cover_image);
    courseDiv.appendChild(image);

    let courseInfo = document.createElement("div");
    courseInfo.setAttribute("class", "course_info");
    let leftInfo = document.createElement("div");
    leftInfo.setAttribute("class", "left_info");

    let title = document.createElement("span");
    title.style.marginBottom = "5px";
    title.style.color = "#6b63dd";
    title.innerText = courses[i].category_title;
    let parentTitle = document.createElement("span");
    parentTitle.style.marginBottom = "5px";
    parentTitle.style.color = "gray";
    parentTitle.innerText = courses[i].parent_category_title;
    let subTitle = document.createElement("span");
    subTitle.style.marginBottom = "5px";
    subTitle.style.color = "gray";
    subTitle.innerText = courses[i].sub_title;
    leftInfo.appendChild(title);
    leftInfo.appendChild(parentTitle);
    leftInfo.appendChild(subTitle);

    let rateDateStatus = document.createElement("div");
    rateDateStatus.setAttribute("class", "rate_part");

    let rate = document.createElement("span");
    rate.style.marginRight = "20px";
    rate.innerText = courses[i].rating;

    let date = document.createElement("span");
    date.style.marginRight = "20px";
    let dateValue = document.createElement("span");
    dateValue.innerText = courses[i].created_at;
    date.appendChild(dateValue);

    let user = document.createElement("span");
    user.setAttribute("class", "avatar_part");
    let trainer = document.createElement("img");
    trainer.setAttribute("class", "trainer_avatar");
    trainer.setAttribute("src", courses[i].trainer_avatar);
    let trainerName = document.createElement("span");
    trainerName.innerText = courses[i].trainer_name;
    user.appendChild(trainer);
    user.appendChild(trainerName);

    rateDateStatus.appendChild(rate);
    rateDateStatus.appendChild(date);
    rateDateStatus.appendChild(user);
    leftInfo.appendChild(rateDateStatus);

    let rightInfo = document.createElement("div");
    rightInfo.setAttribute("class", "right_info");

    let price = document.createElement("span");
    price.style.color = "#13013f";
    price.innerText = courses[i].price;
    let card = document.createElement("span");
    card.style.color = "#6b63dd";
    card.innerText = "Add to card";
    let wishlist = document.createElement("span");
    wishlist.style.color = "#6b63dd";
    wishlist.innerText = "Add to wishlist";

    rightInfo.appendChild(price);
    rightInfo.appendChild(card);
    rightInfo.appendChild(wishlist);

    courseInfo.appendChild(leftInfo);
    courseInfo.appendChild(rightInfo);

    courseDiv.appendChild(courseInfo);
    loaderContent.appendChild(courseDiv);
  }
  page_span.innerHTML = page + " of " + numPages();

  if (page == 1) {
    btn_prev.style.opacity = "0.5";
    btn_prev.style.pointerEvents = "none";
  } else {
    btn_prev.style.opacity = "1";
    btn_prev.style.pointerEvents = "all";
  }

  if (page == numPages()) {
    btn_next.style.opacity = "0.5";
    btn_next.style.pointerEvents = "none";
  } else {
    btn_next.style.opacity = "1";
    btn_next.style.pointerEvents = "all";
  }
}

function numPages() {
  if (courses === undefined) {
    return Math.ceil(1 / records_per_page);
  } else {
    return Math.ceil(courses.length / records_per_page);
  }
}

window.onclick = function () {
  res.style.paddingLeft = "0px";
  res.style.paddingBottom = "0px";
  res.style.border = "none";
  res.style.display = "none";
};
