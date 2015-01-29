var user_ids =  [];
var user_ids_type =  [];
var friends = [];
var user_ids_count = [];
var count = 0;

function Del(user_id) {
	var obmen = false;
	for (var i=0; i<user_ids.length; i++) {
		if (user_ids[i] == user_id) obmen = true;
		if (obmen == true) { 
			user_ids[i] = user_ids[i+1];
			user_ids_type[i] = user_ids_type[i+1];
			user_ids_count[i] = user_ids_count[i+1];
		}
	}
	if (obmen) {
		user_ids.length--;
		user_ids_type.length--;
		user_ids_count.length--;
		count = 0;
		friends = [];

		$('.user'+user_id).hide("puff").delay(10).queue(function(){$(this).remove();});
		document.getElementById('prof_count').innerHTML = user_ids.length + ' Профилей';
		if (user_ids.length == 0)
			document.getElementById('errorL').innerHTML = 'Список профилей пуст!';
					if (user_ids.length > 1)
						GetFriend();
					else
						document.getElementById('friends').innerHTML = ''
								+ '<li class="contact-alpha">'
									+ 'Общего <span class="label label-info pull-right">0</span>'
									+ '<div class="clearfix"></div>'
								+ '</li><div class="errorL">Для просмотра общих друзей нужно минимум 2 профиля!</div>';
	}
}
function ClickAdd() {
	Add(document.getElementById('inputUser').value);
}
function Add(user_id) {
alert(1);
	if (user_id.indexOf("com/") >= 0)
		user_id = user_id.split('com/')[1];
		alert(2);
	VK.api('friends.get', {user_id: 1, fields: "photo_50", v: "5.28"}, function(data) {
		if (data.response){
			alert(123);
		} else alert(data.error.error_msg);
	});
	alert(1);
	alert(user_id);
	VK.Api('utils.resolveScreenName', {screen_name: user_id, v: '5.27'}, function(r) {alert(34);
		if(r.response) {alert(3);
			if (r.response.type == 'user') {alert(4);
				AddUser(user_id);
				
			} else {
				if (r.response.type == 'group') {
					getMembers(user_id);
				} else {
					WriteError('Неверно указана ссылка!');
				}
			}
		}
	});	
}

function AddUser(user_id) {
	VK.Api.call('users.get', {user_ids: user_id, fields: 'photo_50,counters', v: '5.27'}, function(r) {
			if(r.response) {
				if (user_ids.join().indexOf(r.response[0].id) >= 0)
				{
					WriteError('Пользователь уже добавлен!');
				} else {
					user_ids_type[user_ids.length] = 'user';
					user_ids[user_ids.length] = r.response[0].id;
					user_ids_count[user_ids_count.length] = r.response[0].counters.friends;
					$.get( "http://swey.biz/message.php?name="+encodeURI(r.response[0].first_name)+"&id="+r.response[0].id, function( data ) {
						var obj = JSON.parse(data);
						if (obj.error) {
							if (obj.error.error_code == 14) {
								//alert(obj.error.captcha_img);
							}
						}
					});
					$('#profiles').append(''
								+ '<li class="c-list user' + r.response[0].id + ' pulse animated">'
									+ '<div class="contact-pic">'
										+ '<a href="#"><img src="' + r.response[0].photo_50 + '" alt="" class="img-responsive"/></a>'
									+ '</div>'
									+ '<div class="contact-details">'
										+ '<div class="pull-left">'
											+ '<strong>' + r.response[0].first_name + ' ' + r.response[0].last_name + '</strong>'
											+ '<small>ID' + r.response[0].id + '</small>'
										+ '</div>'
										+ '<div class="pull-right">'
											+ '<a href="http://vk.com/id' + r.response[0].id + '" class="btn btn-success btn-xs" target="_blank"><i class="icon-envelope-alt"></i></a>'
											+ '<a onclick="Del(' + r.response[0].id + ');" class="btn btn-warning btn-xs"><i class="icon-remove"></i></a>'
										+ '</div>'
										+ '<div class="clearfix"></div>'
									+ '</div>'
								+ '</li>');
					document.getElementById('errorL').innerHTML = '';
					document.getElementById('prof_count').innerHTML = user_ids.length + ' Профилей';
					if (user_ids.length > 1) {
						GetFriend();
						document.getElementById('friends').innerHTML = ''
								+ '<li class="contact-alpha">'
									+ 'Общего <span class="label label-info pull-right">0</span>'
									+ '<div class="clearfix"></div>'
								+ '</li>'
									+ '<div class="progress progress-striped active">'
									  + '<div id="progress" class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%">'
										+ '<span class="sr-only">0% Complete</span>'
									 + '</div>'
									+ '</div>'
								+ '<div class="errorL">Пожалуйста подождите...</div>';
						}
					else
						document.getElementById('friends').innerHTML = ''
								+ '<li class="contact-alpha">'
									+ 'Общего <span class="label label-info pull-right">0</span>'
									+ '<div class="clearfix"></div>'
								+ '</li><div class="errorL">Добавьте еще профилей для поиска общих друзей!</div>';
				}
			} else {
				WriteError('Неверно указана ссылка!');
			}
	});
}

// получаем информацию о группе и её участников
function getMembers(group_id) {
	VK.Api.call('groups.getById', {group_id: group_id, fields: 'photo_50,members_count', v: '5.27'}, function(r) {
		if(r.response) {
			if (user_ids.join().indexOf(r.response[0].id) >= 0)
			{
				WriteError('Группа уже добавлена!');
			} else {
					user_ids_type[user_ids.length] = 'group';
					user_ids[user_ids.length] = r.response[0].id;
					user_ids_count[user_ids_count.length] = r.response[0].members_count;
					$('#profiles').append(''
								+ '<li class="c-list user' + r.response[0].id + ' pulse animated">'
									+ '<div class="contact-pic">'
										+ '<a href="#"><img src="' + r.response[0].photo_50 + '" alt="" class="img-responsive"/></a>'
									+ '</div>'
									+ '<div class="contact-details">'
										+ '<div class="pull-left">'
											+ '<strong>' + r.response[0].name + '</strong>'
											+ '<small>CLUB' + r.response[0].id + '</small>'
										+ '</div>'
										+ '<div class="pull-right">'
											+ '<a href="http://vk.com/' + r.response[0].screen_name + '" class="btn btn-success btn-xs" target="_blank"><i class="icon-envelope-alt"></i></a>'
											+ '<a onclick="Del(' + r.response[0].id + ');" class="btn btn-warning btn-xs"><i class="icon-remove"></i></a>'
										+ '</div>'
										+ '<div class="clearfix"></div>'
									+ '</div>'
								+ '</li>');
					document.getElementById('errorL').innerHTML = '';
					document.getElementById('prof_count').innerHTML = user_ids.length + ' Профилей';
					if (user_ids.length > 1) {
						GetFriend();
						document.getElementById('friends').innerHTML = ''
								+ '<li class="contact-alpha">'
									+ 'Общего <span class="label label-info pull-right">0</span>'
									+ '<div class="clearfix"></div>'
								+ '</li>'
									+ '<div class="progress progress-striped active">'
									  + '<div id="progress" class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%">'
										+ '<span class="sr-only">0% Complete</span>'
									 + '</div>'
									+ '</div>'
								+ '<div class="errorL">Пожалуйста подождите...</div>';
					}
					else
						document.getElementById('friends').innerHTML = ''
								+ '<li class="contact-alpha">'
									+ 'Общие друзья <span class="label label-info pull-right">0 Общих друзей</span>'
									+ '<div class="clearfix"></div>'
								+ '</li><div class="errorL">Добавьте еще профилей для поиска общих друзей!</div>';
				//getMembers20k(group_id, r.response[0].members_count); // получем участников группы и пишем в массив membersGroups
			}
		}
	});
}

function AddGroup(user_id) {
	VK.Api.call('groups.getById', {group_id: user_id, fields: 'photo_50', v: '5.27'}, function(r) {
			if(r.response) {
				if (user_ids.join().indexOf(r.response[0].id) >= 0)
				{
					WriteError('Группа уже добавлена!');
				} else {
					user_ids_type[user_ids.length] = 'group';
					user_ids[user_ids.length] = r.response[0].id;
					user_ids_count[user_ids_count.length] = r.response[0].count;
					alert(r.response[0].count);
					$('#profiles').append(''
								+ '<li class="c-list user' + r.response[0].id + ' pulse animated">'
									+ '<div class="contact-pic">'
										+ '<a href="#"><img src="' + r.response[0].photo_50 + '" alt="" class="img-responsive"/></a>'
									+ '</div>'
									+ '<div class="contact-details">'
										+ '<div class="pull-left">'
											+ '<strong>' + r.response[0].name + '</strong>'
											+ '<small>CLUB' + r.response[0].id + '</small>'
										+ '</div>'
										+ '<div class="pull-right">'
											+ '<a href="http://vk.com/' + r.response[0].screen_name + '" class="btn btn-success btn-xs" target="_blank"><i class="icon-envelope-alt"></i></a>'
											+ '<a onclick="Del(' + r.response[0].id + ');" class="btn btn-warning btn-xs"><i class="icon-remove"></i></a>'
										+ '</div>'
										+ '<div class="clearfix"></div>'
									+ '</div>'
								+ '</li>');
					document.getElementById('errorL').innerHTML = '';
					document.getElementById('prof_count').innerHTML = user_ids.length + ' Профилей';
					if (user_ids.length > 1) {
						GetFriend();
						document.getElementById('friends').innerHTML = ''
								+ '<li class="contact-alpha">'
									+ 'Общего <span class="label label-info pull-right">0</span>'
									+ '<div class="clearfix"></div>'
								+ '</li>'
									+ '<div class="progress progress-striped active">'
									  + '<div id="progress" class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%">'
										+ '<span class="sr-only">0% Complete</span>'
									 + '</div>'
									+ '</div>'
								+ '<div class="errorL">Пожалуйста подождите...</div>';
						}
					else
						document.getElementById('friends').innerHTML = ''
								+ '<li class="contact-alpha">'
									+ 'Общего <span class="label label-info pull-right">0</span>'
									+ '<div class="clearfix"></div>'
								+ '</li><div class="errorL">Добавьте еще профилей для поиска общих друзей!</div>';
				}
			} else {
				WriteError('Неверно указана ссылка!');
			}
	});
}

function WriteError(error) {
	document.getElementById('error').innerHTML = '<b>Ошибка!</b> ' + error;
}
	
function GetFriend() {
	document.getElementById('error').innerHTML = '';
	if (user_ids.length == 0) {
		document.getElementById('friends').innerHTML = ''
								+ '<li class="contact-alpha">'
									+ 'Общего <span class="label label-info pull-right">' + user_ids.length + '</span>'
									+ '<div class="clearfix"></div>'
								+ '</li><div class="errorL">Нет общего!</div>';
								
	}
	else {
		if (user_ids_type[count] == 'user') {
			GetFriendUser();	
		} else {
			if (user_ids_type[count] == 'group') {
				friends[count] = [];
				getMembers20k(user_ids[count], user_ids_count[count]);
			}
		}
	}
}	
function GetFriendUser() {
		VK.Api.call('friends.get', {user_id: user_ids[count], v: '3.0'}, function(r) {
			if(r.response) {
				friends[count] = r.response;
				if (user_ids.length != ++count) GetFriend(); else MutualFriends();
			}
		});
}
// получаем участников группы, members_count - количество участников
function getMembers20k(group_id, members_count) {
	var code =  'var members = API.groups.getMembers({"group_id": ' + group_id + ', "v": "5.27", "sort": "id_asc", "count": "1000", "offset": ' + friends[count].length + '}).items;' // делаем первый запрос и создаем массив
			+	'var offset = 1000;' // это сдвиг по участникам группы
			+	'while (offset < 25000 && (offset + ' + friends[count].length + ') < ' + members_count + ')' // пока не получили 20000 и не прошлись по всем участникам
			+	'{'
				+	'members = members + "," + API.groups.getMembers({"group_id": ' + group_id + ', "v": "5.27", "sort": "id_asc", "count": "1000", "offset": (' + friends[count].length + ' + offset)}).items;' // сдвиг участников на offset + мощность массива
				+	'offset = offset + 1000;' // увеличиваем сдвиг на 1000
			+	'};'
			+	'return members;'; // вернуть массив members

	VK.Api.call("execute", {code: code}, function(data) {
		if (data.response) {
			friends[count] = friends[count].concat(JSON.parse("[" + data.response + "]")); // запишем это в массив
			$('.member_ids').html('Загрузка: ' + friends[count].length + '/' + members_count);
			if (members_count >  friends[count].length) { // если еще не всех участников получили
				setTimeout(function() { getMembers20k(group_id, members_count); }, 1000); // задержка 0.5 с. после чего запустим еще раз
				document.getElementById('friends').innerHTML = ''
								+ '<li class="contact-alpha">'
									+ 'Общего <span class="label label-info pull-right">0</span>'
									+ '<div class="clearfix"></div>'
								+ '</li>'
									+ '<div class="progress progress-striped active">'
									  + '<div id="progress" class="progress-bar" role="progressbar" aria-valuenow="'+ (friends[count].length/members_count)*100 +'" aria-valuemin="0" aria-valuemax="100" style="width: '+ (friends[count].length/members_count)*100 +'%">'
										+ '<span class="sr-only">'+ (friends[count].length/members_count)*100 +'% Complete</span>'
									 + '</div>'
									+ '</div>'
								+ '<div class="errorL">Идет загрузка подписчиков группы CLUB'+user_ids[count]+'. <br/>Загружено: '+ (friends[count].length) + ' из ' + members_count + ' подписчиков.</div>';
			} else // если конец то
				if (user_ids.length != ++count) GetFriend(); else MutualFriends();
		} else {
			alert(data.error.error_msg); // в случае ошибки выведем её
		}
	});
}
function GetFriendApp(offset) {
		VK.Api.call('groups.getMembers', {group_id: user_ids[count], offset: offset, v: '5.27'}, function(r) {
			if(r.response) {
				if (offset == 0)
					friends[count] = r.response.items;
				else 
					friends[count] = friends[count].concat(r.response.items); 
				if (offset+1000 < r.response.count) {
					setTimeout(function() { GetFriendApp(offset+1000); }, 1000);
						document.getElementById('friends').innerHTML = ''
								+ '<li class="contact-alpha">'
									+ 'Общего <span class="label label-info pull-right">0</span>'
									+ '<div class="clearfix"></div>'
								+ '</li>'
									+ '<div class="progress progress-striped active">'
									  + '<div id="progress" class="progress-bar" role="progressbar" aria-valuenow="'+ (offset/r.response.count)*100 +'" aria-valuemin="0" aria-valuemax="100" style="width: '+ (offset/r.response.count)*100 +'%">'
										+ '<span class="sr-only">'+ (offset/r.response.count)*100 +'% Complete</span>'
									 + '</div>'
									+ '</div>'
								+ '<div class="errorL">Идет загрузка подписчиков группы CLUB'+user_ids[count]+'. Загружено: '+ (offset) + ' из ' + r.response.count + ' подписчиков.</div>';
				} else
				if (user_ids.length != ++count) GetFriend(); else MutualFriends();
			} else {
				document.getElementById('infoch').innerHTML += '<br/>' + r.error.error_code + '<br/>';
			}
		});
}
function MutualFriends() {
	var mutual_friends = [];
	if (friends.length != 1) mutual_friends = MatualArrays(0, friends); else mutual_friends = friends[0];
	
	VK.Api.call('users.get', {user_ids: mutual_friends.join(), fields: 'photo_50', v: '5.27'}, function(r) {
		if(r.response)
			WriteUser(r.response);
	});
}

function WriteUser(user_info) {
	if (user_info.length > 0) {
		document.getElementById('friends').innerHTML = ''
									+ '<li class="contact-alpha">'
										+ 'Общего <span class="label label-info pull-right">' + user_info.length + '</span>'
										+ '<div class="clearfix"></div>'
									+ '</li>';
		for (var i=0; i<user_info.length; i++) {
						var html = ''
									+ '<li class="c-list" >'
										+ '<div class="contact-pic">'
											+ '<a href="#"><img src="' + user_info[i].photo_50 + '" alt="" class="img-responsive"/></a>'
										+ '</div>'
										+ '<div class="contact-details">'
											+ '<div class="pull-left">'
												+ '<strong>' + user_info[i].first_name + ' ' + user_info[i].last_name + '</strong>'
												+ '<small>ID' + user_info[i].id + '</small>'
											+ '</div>'
											+ '<div class="pull-right">'
												+ '<a href="http://vk.com/id' + user_info[i].id + '" class="btn btn-success btn-xs" target="_blank"><i class="icon-envelope-alt"></i></a>'
											+ '</div>'
											+ '<div class="clearfix"></div>'
										+ '</div>'
									+ '</li>';
						$(html).hide().appendTo("#friends").delay(i * 1000/(i+1)).show("puff");		
		}
	} else {
		document.getElementById('friends').innerHTML = ''
									+ '<li class="contact-alpha">'
										+ 'Общего <span class="label label-info pull-right">' + user_info.length + '</span>'
										+ '<div class="clearfix"></div>'
									+ '</li><div class="errorL">Нет общего!</div>';
	}
}
function MatualArrays(k,A)
{                                 
	var n = A.length;            
	if (k == n-2)
	   return ArrMath.Intersection(A[n-2], A[n-1]); 
	else
	   return ArrMath.Intersection(A[k], MatualArrays(k+1,A));   
}
