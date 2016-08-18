(function($) {
  var ZBW = window.ZBW || {};
  window.ZBW = ZBW;

  ZBW.SortableTable = (function() {
    var init;

    init = function() {
      $('.table.table-sortable th').click(function() {
        var $this = $(this);
        var $thead = $this.parent().parent();
        var $table = $thead.parent();
        var $tbody = $('tbody', $table);
        var desc = true;

        if ($this.hasClass('sort-desc')) {
          desc = false;
        }

        $('th', $thead).removeClass('sort-asc sort-desc');
        if (desc) {
          $this.addClass('sort-desc');
        } else {
          $this.addClass('sort-asc');
        }

        var idx = $this.index();
        var $tr = $('tr', $tbody);
        $tr.sort(function(a, b) {
          var $a = $(a);
          var $b = $(b);

          var $td1 = $('td', $a).eq(idx);
          var $td2 = $('td', $b).eq(idx);
          var val1 = $td1.attr('data-sort-val');
          var val2 = $td2.attr('data-sort-val');

          if (desc) {
            if (val1 < val2) {
              return 1;
            } else {
              return -1;
            }
          } else {
            if (val1 < val2) {
              return -1;
            } else {
              return 1;
            }
          }
        });
        $tr.detach().appendTo($tbody);
      });
    };

    return {
      init: init
    };
  })();
  $(function() {
    ZBW.SortableTable.init();
  });

  ZBW.makeImgSlider = function(selector, aspect_ratio) {
    var $slider = $(selector);
    var $parent = $slider.parent();
    var img_count;

    var slider_height = $parent.width() * aspect_ratio;
    $parent.css({
      'height': slider_height + 'px'
    });

    // add controls
    var html = '<div class="img-slider-controls"></div>';
    var $controls = $(html);
    $parent.append($controls);

    img_count = $('.img', $slider).length;
    for (var i = 0; i < img_count; ++i) {      
      if (i == 0) {
        html = '<span class="icons-slider-circle-current"></span>';
      } else {
        html = '<span class="icons-slider-circle"></span>';
      }
      var $control = $(html);
      $control.attr('data-position', i);
      $controls.append($control);
    }

    var startTimer, stopTimer, timer_handle;

    /**
     * slide function
     *
     * @position zero based
     */
     function slideTo(position) {
      var $current_img, $current_control;
      var $next_img, $next_control;

      position = parseInt(position) + 1;

      $current_img = $('.img.current', $slider);
      $current_control = $('.icons-slider-circle-current', $controls);
      $next_img = $('.img:nth-child(' + position + ')', $slider);
      $next_control = $('span:nth-child(' + position + ')', $controls);

      $current_img.animate({
        opacity: 0
      }, function() {
      });
      $next_img.animate({
        opacity: 1
      }, function() {
        $current_img.removeClass('current');
        $current_control.removeClass('icons-slider-circle-current').addClass('icons-slider-circle');

        $next_img.addClass('current');
        $next_control.removeClass('icons-slider-circle').addClass('icons-slider-circle-current');

        startTimer();
      });
    }

    // timer
    startTimer = function() {
      timer_handle = setTimeout(function() {
        var $current_control = $('.icons-slider-circle-current', $controls);
        var position = parseInt($current_control.attr('data-position'));
        slideTo((position + 1) % img_count);
      }, 3000);
    };

    stopTimer = function() {
      clearTimeout(timer_handle);
    };

    startTimer();

    // set click handler for controls
    $('span', $controls).click(function() {
      var $this = $(this);

      if ($this.hasClass('icons-slider-circle-current')) {
        return;
      }

      stopTimer();

      var position = parseInt($this.attr('data-position'));
      slideTo(position);
    });
  };

  ZBW.validateEmail = function(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  ZBW.validateTelphone = function(tel) {
    return tel.match(/^[0-9]+$/) && tel.length == 11;
  }

  ZBW.showMessageDialog = function(selector, msg) {
    var $dialog = $(selector);
    if (typeof msg == 'string') {
      var html = '<p>' + msg + '</p>';
      $('.dialog-content', $dialog).empty().append(html);
    } else {
      $('.dialog-content', $dialog).empty().append(msg);
    }

    $('.icons-close, .btn-ok', $dialog).off('click').click(function() {
      $dialog.removeClass('visible');
    });
    $dialog.addClass('visible');
  };

  ZBW.HeaderMenus = (function() {
    var init;

    init = function() {
      var $primary_menus = $('.header-menus .primary-menus');
      var $secondary_menus_container = $('.header-menus .container-secondary-menus');

      var timer_handle;

      function restoreMenus() {
        $('.menu.hovered', $primary_menus).removeClass('hovered');
        $('.secondary-menus.visible', $secondary_menus_container).removeClass('visible');
        
        var $selected = $('.menu.selected', $primary_menus);
        if ($selected.length == 0) {
          return;
        }
        var name = $selected.attr('data-name');
        $('.secondary-menus-' + name, $secondary_menus_container).addClass('visible');
      }

      $('.menu', $primary_menus).hover(function() {
        if (timer_handle) {
          clearTimeout(timer_handle);
        }

        restoreMenus();

        $(this).addClass('hovered');
        var name = $(this).attr('data-name');

        $('.secondary-menus.visible', $secondary_menus_container).removeClass('visible');
        $('.secondary-menus-' + name, $secondary_menus_container).addClass('visible');
      }, function() {
        timer_handle = setTimeout(restoreMenus, 100);
      });

      $('.header-menus .container-secondary-menus').hover(function() {
        if (timer_handle) {
          clearTimeout(timer_handle);
        }
      }, function() {
        timer_handle = setTimeout(restoreMenus, 100);
      });
    };

    return {
      init: init
    };
  })();

  ZBW.Header = (function() {
    var init;
    var $header_main;

    function onSearch($input) {
      var val = $input.val().trim();
      if (val != '') {
        window.location.href = 'main_search.html';
      }
    }

    function initForHeaderSearch() {
      var $input_search = $('.input-search', $header_main);

      $('.icons-search', $header_main).click(function() {
        onSearch($input_search);
      });
      $input_search.keyup(function(event) {
        if (event.keyCode == 13) {
          onSearch($(this));
        }
      });
    }

    function initForBannerSearch() {
      var $container = $('#page-header .header-img-slider');
      var $input_search = $('.input-search', $container);
      $('.btn-search', $container).click(function() {
        onSearch($input_search);
      });
      $input_search.keyup(function(event) {
        if (event.keyCode == 13) {
          onSearch($(this));
        }
      });
    }

    function initForSitesSelection() {
      $('.selection-sites .dropdown > .wrapper', $header_main).click(function() {
        var $container = $('.container-selection', $(this).parent());
        if ($container.hasClass('visible')) {
          $container.removeClass('visible');
        } else {
          $container.addClass('visible');
        }
      });
    }

    init = function() {
      $header_main = $('#page-header .header-main');

      initForSitesSelection();

      initForHeaderSearch();
      initForBannerSearch();

      (function() {
        var timer_handle;
        var profile_hover_in = false;
        function onHover(hover_in) {
          if (hover_in) {
            clearTimeout(timer_handle);
          } else {
            timer_handle = setTimeout(function() {
              $('.container-profile', $header_main).removeClass('menus-visible');
            }, 100);
          }
        }

        $('.container-profile', $header_main).hover(function() {
          $(this).addClass('menus-visible');
          onHover(true);
        }, function() {
          onHover(false);
        });
        $('.container-user-menus', $header_main).hover(function() {
          $('container-profile', $header_main).addClass('menus-visible');
          onHover(true);
        }, function() {
          onHover(false);
        });
      })();
    };

    return {
      init: init
    };
  })();

  $(function() {
    ZBW.HeaderMenus.init();
    ZBW.Header.init();
  });  
})(jQuery);

/**
 *
 *
 * login, register etc.
 *
 */
(function($) {
  var ZBW = window.ZBW || {};
  window.ZBW = ZBW;

  ZBW.Login = (function() {
    var init;

    function validateUsername() {
      var username = $('#username').val().trim();
      var $container = $('.login-username');
      $('.validation', $container).remove();
      if (username == '') {
        var html = '<div class="validation">请输入用户名</div>';
        $container.append(html);
        return false;
      } else {
        return true;
      }
    }

    function validatePassword() {
      var password = $('#password').val().trim();
      var $container = $('.login-password');
      $('.validation', $container).remove();
      if (password == '') {
        var html = '<div class="validation">请输入密码</div>';
        $container.append(html);
        return false;
      } else {
        return true;
      }
    }

    function validateVerifyCode() {
      var val = $('#verify_code').val().trim();
      var $container = $('.container-verify-code');
      $('.validation', $container).remove();
      if (val == '') {
        var html = '<div class="validation">请输入验证码</div>';
        $container.append(html);
        return false;
      } else {
        return true;
      }
    }

    init = function() {
      var $container_login = $('.container-login');
      $('#username, #password').focusin(function() {
        $('span', $(this).prev()).addClass('focused');

        $('.validation', $(this).parent().parent()).remove();
      }).focusout(function() {
        $('span', $(this).prev()).removeClass('focused');
      });

      $('#username').focusout(function() {
        validateUsername();
      });

      $('#password').focusout(function() {
        validatePassword();
      });

      $('#verify_code').focusin(function() {
        $('.validation', $(this).parent().parent().parent()).remove();
      }).focusout(function() {
        validateVerifyCode();
      });

      $('.btn-login').click(function() {
        if (!validateUsername()) {
          return false;
        }

        if (!validatePassword()) {
          return false;
        }

        if (!validateVerifyCode()) {
          return false;
        }

        return true;
      });
    };

    return {
      init: init
    };
  })();

  ZBW.Register = {};
  ZBW.Register.Step1 = (function() {
    var init;
    var $form;

    /**
     * @return value:
     *  weak: 1
     *  medium: 2
     *  strong: 3
     */
    function getPasswordStrength(val) {
      var strength = 0;
      if (val.length <= 6) {
        return strength;
      }

      var arr = [/[0-9]+/, /[a-z]+/, /[A-Z]+/];
      $.map(arr, function(regexp) {
        if (val.match(regexp)) {
          strength++;
        }
      });

      return strength;
    }

    function validateUserType() {
      $('.row-type .hint').removeClass('highlight');
      if ($('.user-type:checked').length == 0) {
        $('.row-type .hint').text('会员类型不能为空');
        $('.row-type .hint').addClass('highlight');
        return false;
      } else {
        $('.row-type .hint').text('请选择会员类型');
        return true;
      }
    }

    function validateUsername() {
      $('.row-username .hint').removeClass('highlight');
      var val = $('#username').val();
      if (val.length < 3 || val.length > 30 || !val.match(/^[0-9a-zA-Z]+$/)) {
        $('.row-username .hint').text('用户名需为3－30个字母或数字');
        $('.row-username .hint').addClass('highlight');
        return false;
      } else {
        $('.row-username .hint').text('请输入3－30个字母或数字');
        return true;
      }
    }

    function validatePassword() {
      $('.row-password .hint').removeClass('highlight');
      var val = $('#password').val();
      if (val.length < 6 || val.length > 20) {
        $('.row-password .hint').text('密码需为6－20个字符，区分大小写');
        $('.row-password .hint').addClass('highlight');
        return false;
      } else {
        $('.row-password .hint').text('请输入6－20个字符，区分大小写');
        return true;
      }
    }

    function validateConfirmPassword() {
      $('.row-confirm-password .hint').remove();
      var password = $('#password').val();
      var confirm_password = $('#confirm_password').val();
      if (password != confirm_password) {
        var html = '<span class="hint highlight">两次输入的密码不一致</span>';
        $('.row-confirm-password .col:nth-child(2)').append(html);
        return false;
      } else {
        return true;
      }
    }

    function validateName() {
      $('.row-name .hint').removeClass('highlight');
      var val = $('#name').val();
      if (val.length == 0) {
        $('.row-name .hint').text('姓名不能为空');
        $('.row-name .hint').addClass('highlight');
        return false;
      } else {
        $('.row-name .hint').text('请与身份证姓名保持一致，否则无法通过审核');
        return true;
      }
    }

    function validateSex() {
      $('.row-name .hint').removeClass('highlight');
      if ($('.sex:checked').length == 0) {
        $('.row-name .hint').text('性别不能为空');
        $('.row-name .hint').addClass('highlight');
      } else {
        $('.row-name .hint').text('请与身份证姓名保持一致，否则无法通过审核');
        return true;
      }
    }

    function validateCompanyName() {
      $('.row-company-name .hint').removeClass('highlight');
      var val = $('#company_name').val();
      if (val.length == 0) {
        $('.row-company-name .hint').text('公司名称不能为空');
        $('.row-company-name .hint').addClass('highlight');
        return false;
      } else {
        $('.row-company-name .hint').text('请填写公司全称，与营业执照保持一致');
        return true;
      }
    }

    function validateTelphone() {
      $('.row-phone .hint').removeClass('highlight');
      var val = $('#telphone').val();
      if (!val.match(/^[0-9]+$/) || val.length != 11) {
        $('.row-phone .hint').text('请填写正确的手机号码');
        $('.row-phone .hint').addClass('highlight');
        return false;
      } else {
        $('.row-phone .hint').text('请填写手机号码');
        return true;
      }
    }

    function validateVerifyCode() {
      $('.row-verify-code .hint').remove();
      var val = $('#verify_code').val();
      if (val.length == 0) {
        var html = '<span class="hint highlight">请输入验证码</span>';
        $('.row-verify-code').append(html);        
        return false;
      } else {
        return true;
      }  
    }

    function validateAcceptLicense() {
      $('.row-accept-license .hint').remove();
      if ($('#accept_license:checked').length == 0) {
        var html = '<span class="hint highlight">请接受服务条款</span>';
        $('.row-accept-license').append(html);        
        return false;        
      } else {
        return true;
      }
    }

    init = function() {
      $form = $('.container-register-form');

      $('.user-type').click(function() {
        validateUserType();
      });

      $('#username').focusin(function() {
        $('.row-username .hint').text('请输入3－30个字母或数字');
        $('.row-username .hint').removeClass('highlight');
      }).focusout(function() {
        validateUsername();
      });

      $('#password').focusin(function() {
        $('.row-password .hint').text('请输入6－20个字符，区分大小写');
        $('.row-password .hint').removeClass('highlight');
      }).focusout(function() {
        validatePassword();
      });

      $('#password').keydown(function() {
        setTimeout(function() {
          var val = $('#password').val();

          var strength = getPasswordStrength(val);
          console.log(strength);
          var class_selector;
          if (strength <= 1) {
            class_selector = '.weak';
          } else if (strength < 3) {
            class_selector = '.medium';
          } else {
            class_selector = '.strong';
          }
          var $row_password_complexity = $('.row-password-complexity');
          $('.active', $row_password_complexity).removeClass('active');
          $(class_selector, $row_password_complexity).addClass('active');
        }, 50);
      });

      $('#confirm_password').focusin(function() {
        $('.row-confirm-password .hint').remove();
      }).focusout(function() {
        validateConfirmPassword();
      });

      $('#name').focusin(function() {
        $('.row-name .hint').text('请与身份证姓名保持一致，否则无法通过审核');
        $('.row-name .hint').removeClass('highlight');
      }).focusout(function() {
        validateName();
      });

      $('.sex').click(function() {
        $('.row-name .hint').removeClass('highlight');
        $('.row-name .hint').text('请与身份证姓名保持一致，否则无法通过审核');
      });

      $('#company_name').focusin(function() {
        $('.row-company-name .hint').text('请填写公司全称，与营业执照保持一致');   
        $('.row-company-name .hint').removeClass('highlight');
      }).focusout(function() {
        validateCompanyName();
      });

      $('#telphone').focusin(function() {
        $('.row-phone .hint').text('请填写手机号码');
        $('.row-phone .hint').removeClass('highlight');
      }).focusout(function() {
        validateTelphone();
      });

      $('.btn-send-verify-code').click(function() {
        if (!validateTelphone()) {
          return;
        }

        $('.btn-send-verify-code').prop('disabled', true);
        var count = 60;
        function tick() {
          count--;
          if (count == 0) {
            $('.btn-send-verify-code').text('点击发送验证码');
            $('.btn-send-verify-code').prop('disabled', false);
          } else {
            $('.btn-send-verify-code').text(count + '秒后重新发送');
            setTimeout(tick, 1000);
          }
        }
        setTimeout(tick, 0);
      });

      $('#verify_code').focusin(function() {
        $('.row-verify-code .hint').remove();
      }).focusout(function() {
        validateVerifyCode();
      });

      $('#accept_license').click(function() {
        if ($(this).prop('checked')) {
          $('.row-accept-license .hint').remove();
        }
      });

      $('.btn-submit', $form).click(function() {
        if (!validateUserType()) {
          return false;
        }

        if (!validateUsername()) {
          return false;
        }

        if (!validatePassword()) {
          return false;
        }

        if (!validateConfirmPassword()) {
          return false;
        }

        if (!validateName()) {
          return false;
        }

        if (!validateSex()) {
          return false;
        }

        if (!validateCompanyName()) {
          return false;
        }

        if (!validateTelphone()) {
          return false;
        }

        if (!validateVerifyCode()) {
          return false;
        }

        if (!validateAcceptLicense()) {
          return false;
        }

        window.location.href = "zhu_ce_2.html";
        return false;
      });

      var $license_dialog = $('#license_dialog');
      $('.btn-show-license-dialog').click(function() {
        $license_dialog.addClass('visible');
      });
      $('.icons-close, .btn-finish-read').click(function() {
        $license_dialog.removeClass('visible');
      });
    };

    return {
      init: init
    };
  })();

  ZBW.Register.Step2 = function() {
    var init, initValidation;
    var $dropdowns;

    function hideSelection() {
      $('.container-selections', $dropdowns).removeClass('visible');
    }

    init = function() {
      $dropdowns = $('.container-register .dropdown');
      $('.wrapper', $dropdowns).click(function(event) {
        event.stopPropagation();
        
        var $parent = $(this).parent();
        var $container_selections = $('.container-selections', $parent);

        if ($container_selections.hasClass('visible')) {
          $container_selections.removeClass('visible');
          return;
        }

        hideSelection();
        $container_selections.addClass('visible');
      });

      $('.selection', $dropdowns).click(function() {
        event.stopPropagation();

        var $selections = $(this).parent().parent();

        if ($(this).hasClass('selected')) {
          $(this).removeClass('selected');
        } else {
          if ($selections.hasClass('selections-single')) {
            $('.selection', $selections).removeClass('selected');
          }

          $(this).addClass('selected');
        }

        var text = '', val = '';
        $('.selection.selected', $selections).each(function(idx, e) {
          var $e = $(e);
          if (idx == 0) {
            text = $e.text().trim();
            val = $e.attr('data-value');
          } else {
            text += ', ' + $e.text().trim();
            val += ',' + $e.attr('data-value');
          }
        });

        $('input[type="text"]', $selections.parent().parent().parent()).val(text);
        $('input[type="hidden"]', $selections.parent()).val(val);

        if ($selections.hasClass('selections-single')) {
          hideSelection();
        }
      });

      $('.btn-finish-selection', $dropdowns).click(function(event) {
        event.stopPropagation();

        hideSelection();
      });

      $('.container-selections', $dropdowns).click(function(event) {
        event.stopPropagation();
      });

      $(document).click(function() {
        hideSelection();
      });
    };

    return {
      init:init
    };
  }();

  ZBW.FindPassword = {};
  ZBW.FindPassword.Step1 = (function() {
    var init;

    function validateUsername() {
      $('.row-username .hint').remove();
      var val = $('#username').val();
      if (val.length == 0) {
        var html = '<span class="hint">请输入用户名</span>';
        $('.row-username').append(html);
        $('.row-username .hint').addClass('highlight');
        return false;
      } else {
        return true;
      }
    }

    function validateTelphone() {
      $('.row-phone .hint').remove();
      var val = $('#telphone').val();
      if (!val.match(/^[0-9]+$/) || val.length != 11) {
        var html = '<span class="hint">请填写正确的手机号码</span>';
        $('.row-phone').append(html);
        $('.row-phone .hint').addClass('highlight');
        return false;
      } else {
        return true;
      }
    }

    function validateVerifyCode() {
      $('.row-verify-code .hint').remove();
      var val = $('#verify_code').val();
      if (val.length == 0) {
        var html = '<span class="hint highlight">请输入验证码</span>';
        $('.row-verify-code').append(html);        
        return false;
      } else {
        return true;
      }  
    }

    init = function() {
      $('#username').focusin(function() {
        $('.row-username .hint').remove();
      }).focusout(function() {
        validateUsername();
      });      

      $('#telphone').focusin(function() {
        $('.row-phone .hint').remove();
      }).focusout(function() {
        validateTelphone();
      });

      $('#verify_code').focusin(function() {
        $('.row-verify-code .hint').remove();
      }).focusout(function() {
        validateVerifyCode();
      });

      $('.btn-send-verify-code').click(function() {
        if (!validateTelphone()) {
          return;
        }

        $('.btn-send-verify-code').prop('disabled', true);
        var count = 60;
        function tick() {
          count--;
          if (count == 0) {
            $('.btn-send-verify-code').text('点击发送验证码');
            $('.btn-send-verify-code').prop('disabled', false);
          } else {
            $('.btn-send-verify-code').text(count + '秒后重新发送');
            setTimeout(tick, 1000);
          }
        }
        setTimeout(tick, 0);
      });

      $('.container-find-password .btn-submit').click(function() {
        if (!validateUsername()) {
          return false;
        }

        if (!validateTelphone()) {
          return false;
        }

        if (!validateVerifyCode()) {
          return false;
        }

        window.location.href='wang_ji_mi_ma_2.html';
        return false;
      });
    };

    return {
      init: init
    };
  })();

  ZBW.FindPassword.Step2 = (function() {
    var init;

    function validatePassword() {
      $('.row-password .hint').remove();
      var val = $('#password').val();
      if (val.length < 6 || val.length > 20) {
        var html = '<span class="hint highlight">密码需为6－20个字符，区分大小写</span>';
        $('.row-password').append(html);
        return false;
      } else {
        return true;
      }
    }

    function validateConfirmPassword() {
      $('.row-confirm-password .hint').remove();
      var password = $('#password').val();
      var confirm_password = $('#confirm_password').val();
      if (password != confirm_password) {
        var html = '<span class="hint highlight">两次输入的密码不一致</span>';
        $('.row-confirm-password .col:nth-child(2)').append(html);
        return false;
      } else {
        return true;
      }
    }    

    init = function() {
      $('#password').focusin(function() {
        $('.row-password .hint').remove();
      }).focusout(function() {
        validatePassword();
      });

      $('#confirm_password').focusin(function() {
        $('.row-confirm-password .hint').remove();
      }).focusout(function() {
        validateConfirmPassword();
      });            

      $('.container-find-password .btn-submit').click(function() {
        if (!validatePassword()) {
          return false;
        }

        if (!validateConfirmPassword()) {
          return false;
        }

        return false;
      });
    };

    return {
      init: init
    };
  })();

  var Profile = ZBW.Profile || {};
  ZBW.Profile = Profile;

  Profile.Info = (function() {
    var init;
    var $verify_email_dialog;

    init = function() {
      $verify_email_dialog = $('#verify_email_dialog');
      $('.icons-close, .btn-ok', $verify_email_dialog).click(function() {
        $verify_email_dialog.removeClass('visible');
      });

      $('.container-account-info .btn-verify-email').click(function() {
        $('.email', $verify_email_dialog).text('18888888888@126.com');
        $verify_email_dialog.addClass('visible');
      });
    }; 

    return {
      init: init
    };
  })();

  Profile.Edit = (function() {
    var init, initAvatar, initValidation;
    var $dropdowns;

    function hideSelection() {
      $('.container-selections', $dropdowns).removeClass('visible');
    }

    initAvatar = function() {
      var $container_avatar_selections = $('.container-avatar-selections');
      $('.btn-choose-avatar').click(function(event) {
        event.stopPropagation();

        if ($container_avatar_selections.hasClass('visible')) {
          $container_avatar_selections.removeClass('visible');
        } else {
          $container_avatar_selections.addClass('visible');
        }
      });

      $('.selection', $container_avatar_selections).click(function() {
        event.stopPropagation();
        $('.selection', $container_avatar_selections).removeClass('selected');
        $(this).addClass('selected');
      });

      $('.btn-finish', $container_avatar_selections).click(function() {
        var $img = $('.selection.selected img', $container_avatar_selections);
        if ($img.length != 0) {
          $('img.img-avatar').attr('src', $img.attr('src'));
        }
        $container_avatar_selections.removeClass('visible');
      });

      $container_avatar_selections.click(function(event) {
        event.stopPropagation();
      });

      $(document).click(function() {
        $container_avatar_selections.removeClass('visible');
      });
    };

    initValidation = function() {
      function validatePhone() {
        $('.row-phone .hint').remove();
        var val = $('#telphone').val();
        if (!val.match(/^[0-9]+$/) || val.length != 11) {
          var html = '<span class="hint highlight">请填写正确的手机号码</span>';
          $('.row-phone .col-val').append(html);
          return false;
        } else {
          return true;
        }        
      }

      function validateEmail() {
        $('.row-email .hint').remove();
        var val = $('#email').val();
        if (ZBW.validateEmail(val)) {
          return true;
        } else {
          var html = '<span class="hint highlight">请填写正确的邮箱</span>';
          $('.row-email .col-val').append(html);
          return false;
        }
      }

      $('#telphone').focusin(function() {
        $('.row-phone .hint').remove();
      }).focusout(function() {
        validatePhone();
      });

      $('#email').focusin(function() {
        $('.row-email .hint').remove();
      }).focusout(function() {
        validateEmail();
      });

      $('.container-edit-account-info .btn-save').click(function() {
        if (!validatePhone()) {
          return false;
        }

        if (!validateEmail()) {
          return false;
        }

        window.location.href = "profile.html";
        return false;
      });
    };

    init = function() {
      initAvatar();

      initValidation();

      $dropdowns = $('.container-edit-account-info .dropdown');

      $('.btn-selection', $dropdowns).click(function() {
        event.stopPropagation();
        
        var $parent = $(this).parent().parent().parent();
        var $container_selections = $('.container-selections', $parent);

        if ($container_selections.hasClass('visible')) {
          $container_selections.removeClass('visible');
          return;
        }

        hideSelection();
        $container_selections.addClass('visible');
      });

      $('.selection', $dropdowns).click(function() {
        event.stopPropagation();

        var $selections = $(this).parent().parent();

        if ($(this).hasClass('selected')) {
          $(this).removeClass('selected');
        } else {
          if ($selections.hasClass('selections-single')) {
            $('.selection', $selections).removeClass('selected');
          }

          $(this).addClass('selected');
        }

        var $container_selected = $('.container-selected', $selections.parent().parent().parent());

        var val = '', append_ellipse = false;
        $container_selected.empty();
        $('.selection.selected', $selections).each(function(idx, e) {
          var $e = $(e);
          if (idx < 3) {
            $container_selected.append($e.clone());  
          } else {
            append_ellipse = true;
          }
          
          if (idx == 0) {
            val = $e.attr('data-value');
          } else {
            val += ',' + $e.attr('data-value');
          }
        });

        if (append_ellipse) {
          $container_selected.append('<span class="more">...</span>')
        }

        $('input[type="hidden"]', $selections.parent()).val(val);

        if ($selections.hasClass('selections-single')) {
          hideSelection();
        }
      });      

      $('.btn-finish-selection', $dropdowns).click(function(event) {
        event.stopPropagation();

        hideSelection();
      });

      $('.container-selections', $dropdowns).click(function(event) {
        event.stopPropagation();
      });

      $(document).click(function() {
        hideSelection();
      });
    };

    return {
      init: init
    };
  })();

  Profile.ModifyPassword = (function() {
    var init;

    function validatePassword() {
      $('.row-password .hint').remove();
      var val = $('#old_password').val().trim();
      if (val.length == 0) {
        var html = '<span class="hint highlight">密码不能为空</span>';
        $('.row-password .col-val').append(html);
        return false;
      } else {
        return true;
      }
    }

    function validateNewPassword() {
      $('.row-new-password .hint').remove();
      var val = $('#new_password').val().trim();
      if (val.length == 0) {
        var html = '<span class="hint highlight">新密码不能为空</span>';
        $('.row-new-password .col-val').append(html);
        return false;
      } else if (val == $('#old_password').val().trim()) {
        var html = '<span class="hint highlight">新密码不可与旧密码相同</span>';
        $('.row-new-password .col-val').append(html);
        return false;        
      } else {
        return true;
      }
    }

    function validateConfirmPassword() {
      $('.row-confirm-password .hint').remove();
      var val = $('#confirm_password').val().trim();
      if (val != $('#new_password').val().trim()) {
        var html = '<span class="hint highlight">两次输入的密码不一致</span>';
        $('.row-confirm-password .col-val').append(html);
        return false;
      } else {
        return true;
      }
    }

    init = function() {
      var $container = $('.container-modify-password');

      $('#old_password').focusin(function() {
        $('.row-password .hint').remove();
      }).focusout(function() {
        validatePassword();
      });

      $('#new_password').focusin(function() {
        $('.row-new-password .hint').remove();
      }).focusout(function() {
        validateNewPassword();
      });

      $('#confirm_password').focusin(function() {
        $('.row-confirm-password .hint').remove();
      }).focusout(function() {
        validateConfirmPassword();
      });

      $('.btn-save', $container).click(function() {
        if (!validatePassword()) {
          return false;
        }

        if (!validateNewPassword()) {
          return false;
        }

        if (!validateConfirmPassword()) {
          return false;
        }

        var $dialog = $('#modify_password_result_dialog');
        $('.dialog-content', $dialog).append('<p>密码修改成功，请您重新登录。</p>');
        $dialog.addClass('visible');
        $('.icons-close, .btn-ok').off('click').click(function() {
          $dialog.removeClass('visible');
          window.location.href = 'deng_lu.html';
        });

        return false;
      });
    };

    return {
      init: init
    };
  })();

  ZBW.ManageSubscribe = (function() {
    var init;
    var $msg_dialog;

    function showErrorMsg(msg) {
      $('.dialog-content', $msg_dialog).empty().append('<p>' + msg + '</p>');
      $msg_dialog.addClass('visible');
    }

    function validateEmailCount(add_situation) {
      var count = 0;
      var limit = 5;
      $('.container-address-email .input-addr').each(function(idx, e) {
        if ($(e).val() != '') {
          count++;
        }
      });

      if (add_situation && count == limit || count > limit) {
        showErrorMsg('您最多可以订阅' + limit + '个邮箱。');
        return false;
      } else {
        return true;
      }
    }

    function validateTelphoneCount(add_situation) {
      var count = 0;
      var limit = 3;
      $('.container-address-phone .input-addr').each(function(idx, e) {
        if ($(e).val() != '') {
          count++;
        }
      });

      if (add_situation && count == limit || count > limit) {
        showErrorMsg('您最多可以订阅' + limit + '个手机。');
        return false;
      } else {
        return true;
      }
    }

    init = function() {
      $msg_dialog = $('#message_dialog');
      $('.icons-close, .btn-ok', $msg_dialog).click(function() {
        $msg_dialog.removeClass('visible');
      });

      $('.container-address .btn-add-address').click(function() {
        var $parent = $(this).parent();
        var $input_text = $('input[type="text"]', $parent);
        if ($(this).hasClass('btn-add-email')) {
          var email = $input_text.val().trim();
          if (!ZBW.validateEmail(email)) {
            showErrorMsg('请输入正确的邮箱');
            $input_text.focus();
            return;
          }

          if (!validateEmailCount(true)) {
            return;
          }
        } else {
          var tel = $input_text.val().trim();
          if (!ZBW.validateTelphone(tel)) {
            showErrorMsg('请输入正确的手机号码');
            $input_text.focus();
            return;
          }

          if (!validateTelphoneCount(true)) {
            return;
          }
        }

        var $new_node = $parent.clone();
        $('button', $new_node).remove();
        $new_node.insertBefore($parent);
        $input_text.val('');
      });

      $('.container-subscribe .btn-save').click(function() {
        var $form = $(this).parent().parent();
        $('.hint', $form).remove();

        if ($(this).hasClass('btn-save-email')) {
          $('.input-addr', $form).each(function(idx, e) {
            var $e = $(e);
            if ($e.val() != '' && !ZBW.validateEmail($e.val())) {
              var html = '<span class="hint highlight">请输入正确的邮箱</span>';
              $('.hint', $e.parent()).remove();
              $e.parent().append(html);
              return false;
            }
          });
        } else {
          $('.input-addr', $form).each(function(idx, e) {
            var $e = $(e);
            if ($e.val() != '' && !ZBW.validateTelphone($e.val())) {
              var html = '<span class="hint highlight">请输入正确的手机号码</span>';
              $('.hint', $e.parent()).remove();
              $e.parent().append(html);
              return false;
            }
          });          
        }

        if ($('input[name="freq"]:checked', $form).length == 0) {
          var html = '<span class="hint highlight">请选择频率</span>';
          $('.frequence-list', $form).append(html);
          return false;
        }

        return false;
      });
    };

    return {
      init: init
    };
  })();

  ZBW.Subscribe = (function() {
    var init;
    var $subscribe_list;

    init = function() {
      $subscribe_list = $('.container-subscribe-item-list');
      $('.btn-remove', $subscribe_list).click(function() {
        var $remove_dialog = $('#remove_subscribe_dialog');
        var text = $(this).prev().text();
        var html = '<p>您确定要删除<span style="color:red;margin:0 10px;">' + text + '</span>订阅器吗？</p>';
        $('.dialog-content', $remove_dialog).empty().append(html);

        $('.icons-close, .btn-cancel').off('click').click(function() {
          $remove_dialog.removeClass('visible');
        });

        $('.btn-ok', $remove_dialog).off('click').click(function() {
          // TODO
        });

        $remove_dialog.addClass('visible');
      });
    };

    return {
      init: init
    };
  })();

  ZBW.Subscribe.Edit = (function() {
    var initGenericSelections, initProvinceSelections;
    var validateSelection;

    initGenericSelections = function($rows) {
      $('.selection', $rows).click(function() {
        var $parent = $(this).parent();
        var selected = $(this).hasClass('selected');

        if ($parent.hasClass('selections-single') && !selected) {
          $('.selection.selected', $parent).removeClass('selected');
        }

        if (selected) {
          $(this).removeClass('selected');
        } else {
          $(this).addClass('selected');
        }
      });
    };

    initProvinceSelections = function() {
      function areAllProvincesInRegionSelected($region) {
        var all_selected = true;

        $('.selection-second-level-group .selection', $region).each(function(index, element) {
            if (!$(element).hasClass('selected')) {
              all_selected = false;
              return false;
            }
        });

        return all_selected;
      }

      function areAllRegionsSelected() {
        var all_selected = true;

        $('.row-province .selections').each(function(index, element) {
          if (index != 0) {
            if (!areAllProvincesInRegionSelected($(element))) {
              all_selected = false;
              return false;
            }
          }
        });

        return all_selected;
      }

      function onAllSelectionChanged($element) {
        if ($element.hasClass('selected')) {
          $('.row-province .selection').removeClass('selected');
          removePartialSelection($('.row-province .selection-partial'));          
        } else {
          $('.row-province .selection').addClass('selected');
        }
      }

      function onRegionSelectionChanged($element) {
        if ($element.hasClass('selected')) {
          $('.selection', $element.parent()).removeClass('selected');
          removePartialSelection($('.selection-partial', $element.parent()));
        } else {
          $('.selection', $element.parent()).addClass('selected');
        }

        if (areAllRegionsSelected()) {
          $('.row-province .selection-all').addClass('selected');
        } else {
          $('.row-province .selection-all').removeClass('selected');
        }
      }

      function removePartialSelection($provinces) {
        $provinces.each(function(idx, e) {
          var $e = $(e);
          var province = $e.attr('data-province');
          $('.row-city .selections[data-province="' + province + '"] .selection.selected').removeClass('selected');
            $e.removeClass('selection-partial');
            $('.partial', $e).remove();
        });

        var $row_city = $('.row-city');
        $('.selections.visible', $row_city).removeClass('visible');
        $('.hint', $row_city).addClass('visible');        
      }

      function onProvinceSelectionChanged($element) {
        var $row_city = $('.row-city');
        var province = $element.attr('data-province');

        if ($element.hasClass('selected')) {
          $element.removeClass('selected');

          $('.row-city .selections[data-province="' + province + '"] .selection.selected').removeClass('selected');

          if ($element.hasClass('selection-partial')) {
            $element.removeClass('selection-partial');
            $('.partial', $element).remove();
          }

          $('.selections.visible', $row_city).removeClass('visible');
          $('.hint', $row_city).addClass('visible');
        } else {
          $element.addClass('selected');

          var $city_selections = $('.row-city .selections[data-province="' + province + '"]');
          if ($city_selections.length != 0) {
            $('.selections.visible', $row_city).removeClass('visible');
            $('.hint', $row_city).removeClass('visible');
            $city_selections.addClass('visible');
          }
        }

        var $region = $element.parent().parent();
        if (areAllProvincesInRegionSelected($region)) {
          $('.selection-first-level', $region).addClass('selected');
        } else {
          $('.selection-first-level', $region).removeClass('selected');
        }

        if (areAllRegionsSelected()) {
          $('.row-province .selection-all').addClass('selected');
        } else {
          $('.row-province .selection-all').removeClass('selected');
        }        
      }

      $('.row-province .selection').click(function() {
        if ($(this).hasClass('selection-all')) {
          onAllSelectionChanged($(this));
        } else if ($(this).hasClass('selection-first-level')) {
          onRegionSelectionChanged($(this));
        } else {
          onProvinceSelectionChanged($(this));
        }
      });

      $('.row-city .selection').click(function() {
        var $parent = $(this).parent();

        if ($(this).hasClass('selected')) {
          $(this).removeClass('selected');
        } else {
          $(this).addClass('selected');
        }

        var selected_count = 0;
        $('.selection', $parent).each(function(idx, e) {
          if ($(e).hasClass('selected')) {
            selected_count++;
          }
        });

        var $province = $('.row-province .selection[data-province="' + $parent.attr('data-province') + '"]');

        if (selected_count > 0 && selected_count < $('.selection', $parent).length) {
          if (!$province.hasClass('selection-partial')) {
            $province.addClass('selection-partial');
            $province.append('<span class="partial">半</span>');
          }
        } else {
          $province.removeClass('selection-partial');
          $('.partial', $province).remove();
        }
      });
    };

    validateSelection = function($row, error_msg) {
      var $selections = $('.selections', $row);
      $('.hint', $selections).remove();      
      if ($('.selected', $row).length == 0) {
        $selections.append('<span class="hint highlight">' + error_msg + '</span>');
        return false;
      }
      return true;
    };

    var validateName = function() {
      var $container = $('.row-name > div:last-child');
      $('.hint', $container).remove();
      var val = $('#subscribe_name').val();
      if (val.length == 0 || val.length > 10) {
        var html;
        if (val.length == 0) {
          html = '<span class="hint highlight">订阅器名称不能为空</span>';  
        } else {
          html = '<span class="hint highlight">订阅器名称必须在10个字符以内</span>';
        }
        $container.append(html);
        return false;
      } else {
        return true;
      }
    };

    var showErrorMsg = function(msg) {
      var $dialog = $('#message_dialog');
      if (typeof msg == 'string') {
        $('.dialog-content', $dialog).empty().append('<p>' + msg + '</p>');
      } else {
        $('.dialog-content', $dialog).empty().append(msg);
      }
      $('.icons-close, .btn-ok', $dialog).off('click').click(function() {
        $dialog.removeClass('visible');
      });
      $dialog.addClass('visible');
    };

    var validateKeywords = function() {
      $('.row-keywords .hint').remove();

      var has_keyword = false;
      $('.row-keywords .keyword').each(function(idx, e) {
        if ($(e).val() != '') {
          has_keyword = true;
          return false;
        }
      });

      if (!has_keyword) {
        var html = '<span class="hint highlight">请至少添加一个关键词</span>';
        $(html).insertAfter($('.btn-add-keyword'));
        return false;
      } else {
        return true;
      }
    };

    var initAddKeywordBtn = function() {
      $('.btn-add-keyword').click(function() {
        $('.row-keywords .hint').remove();

        var limit = 5;
        var $keywords = $('.row-keywords .keyword');
        if ($keywords.length >= limit) {
          showErrorMsg('最多只能添加' + limit + '个关键词');
          return;
        }

        var $parent = $(this).parent();
        var $new_node = $parent.clone();
        $('button', $new_node).remove();
        $new_node.insertBefore($parent);
        $('.keyword', $parent).val('');
      });
    };

    var validateProvince = function() {
      if ($('.row-province .selection.selected').length == 0) {
        showErrorMsg('请选择省份');
        return false;
      } else {
        return true;
      }
    };

    return {
      initGenericSelections: initGenericSelections,
      initProvinceSelections: initProvinceSelections,
      initAddKeywordBtn: initAddKeywordBtn,
      validateSelection: validateSelection,
      validateName: validateName,
      validateKeywords: validateKeywords,
      validateProvince: validateProvince,
      showErrorMsg: showErrorMsg
    };
  })();

  ZBW.BidSubscribe = (function() {
    var init;

    init = function() {
      var $rows = $('.row-type, .row-keywords-location, .row-search-method, .row-subscribe', $('.container-form'));
      ZBW.Subscribe.Edit.initGenericSelections($rows);
      ZBW.Subscribe.Edit.initProvinceSelections();

      var SubscribeEdit = ZBW.Subscribe.Edit;

      SubscribeEdit.initAddKeywordBtn();

      var validateSelection = SubscribeEdit.validateSelection;

      $('.container-form .btn-save').click(function() {
        if (!SubscribeEdit.validateName()) {
          return false;
        }

        if (!SubscribeEdit.validateKeywords()) {
          return false;
        }

        if (!validateSelection($('.row-type'), '请选择信息类型')) {
          return false;
        }

        if (!SubscribeEdit.validateProvince()) {
          return false;
        }        

        if (!validateSelection($('.row-keywords-location'), '请选择关键词位置')) {
          return false;
        }

        if (!validateSelection($('.row-search-method'), '请选择搜索方式')) {
          return false;
        }

        if (!validateSelection($('.row-subscribe'), '请选择是否订阅')) {
          return false;
        }

        var html = '<p>添加订阅失败。招标信息下的订阅器数量已达到上限。</p><p>注：招标、采购、项目，每一大类分别可以设置 5 组订阅器。</p>';
        SubscribeEdit.showErrorMsg(html);

        return false;
      });
    };

    return {
      init: init
    };
  })();

  ZBW.CGSubscribe = (function() {
    var init;

    init = function() {
      var $rows = $('.row-type, .row-stage, .row-keywords-location, .row-search-method, .row-subscribe', $('.container-form'));
      ZBW.Subscribe.Edit.initGenericSelections($rows);
      ZBW.Subscribe.Edit.initProvinceSelections();

      var SubscribeEdit = ZBW.Subscribe.Edit;

      SubscribeEdit.initAddKeywordBtn();

      var validateSelection = SubscribeEdit.validateSelection;

      $('.container-form .btn-save').click(function() {
        if (!SubscribeEdit.validateName()) {
          return false;
        }

        if (!SubscribeEdit.validateKeywords()) {
          return false;
        }

        if (!validateSelection($('.row-type'), '请选择信息类型')) {
          return false;
        }

        if (!validateSelection($('.row-stage'), '请选择采购阶段')) {
          return false;
        }        

        if (!SubscribeEdit.validateProvince()) {
          return false;
        }        

        if (!validateSelection($('.row-keywords-location'), '请选择关键词位置')) {
          return false;
        }

        if (!validateSelection($('.row-search-method'), '请选择搜索方式')) {
          return false;
        }

        if (!validateSelection($('.row-subscribe'), '请选择是否订阅')) {
          return false;
        }

        var html = '<p>添加订阅失败。采购信息下的订阅器数量已达到上限。</p><p>注：招标、采购、项目，每一大类分别可以设置 5 组订阅器。</p>';
        SubscribeEdit.showErrorMsg(html);

        return false;
      });
    };

    return {
      init: init
    };
  })();  

  ZBW.ProjectSubscribe = (function() {
    var init;

    function initProjectTypeSelections() {
      $('.row-type .selection').click(function() {
        var $this = $(this);
        var $row_subtype = $('.row-subtype');
        var type = $(this).attr('data-type');

        if ($this.hasClass('selected')) {
          $this.removeClass('selected');

          $('.row-subtype .selections[data-type="' + type + '"] .selection.selected').removeClass('selected');

          if ($this.hasClass('selection-partial')) {
            $this.removeClass('selection-partial');
            $('.partial', $this).remove();
          }

          $('.selections.visible', $row_subtype).removeClass('visible');
          $('.hint', $row_subtype).addClass('visible');
        } else {
          $this.addClass('selected');

          var $subtype_selections = $('.row-subtype .selections[data-type="' + type + '"]');
          if ($subtype_selections.length != 0) {
            $('.selections.visible', $row_subtype).removeClass('visible');
            $('.hint', $row_subtype).removeClass('visible');
            $subtype_selections.addClass('visible');
          }
        }
      });

      $('.row-subtype .selection').click(function() {
        var $parent = $(this).parent();

        if ($(this).hasClass('selected')) {
          $(this).removeClass('selected');
        } else {
          $(this).addClass('selected');
        }

        var selected_count = 0;
        $('.selection', $parent).each(function(idx, e) {
          if ($(e).hasClass('selected')) {
            selected_count++;
          }
        });

        var $type = $('.row-type .selection[data-type="' + $parent.attr('data-type') + '"]');

        if (selected_count > 0 && selected_count < $('.selection', $parent).length) {
          if (!$type.hasClass('selection-partial')) {
            $type.addClass('selection-partial');
            $type.append('<span class="partial">半</span>');
          }
        } else {
          $type.removeClass('selection-partial');
          $('.partial', $type).remove();
        }
      });      
    }

    function validateType() {
      if ($('.row-type .selection.selected').length == 0) {
        ZBW.Subscribe.Edit.showErrorMsg('请选择项目类型');
        return false;
      } else {
        return true;
      }
    }

    init = function() {
      var $rows = $('.row-stage, .row-subscribe', $('.container-form'));
      ZBW.Subscribe.Edit.initGenericSelections($rows);
      ZBW.Subscribe.Edit.initProvinceSelections();

      initProjectTypeSelections();

      var SubscribeEdit = ZBW.Subscribe.Edit;

      SubscribeEdit.initAddKeywordBtn();

      var validateSelection = SubscribeEdit.validateSelection;

      $('.container-form .btn-save').click(function() {
        if (!SubscribeEdit.validateName()) {
          return false;
        }

        if (!SubscribeEdit.validateKeywords()) {
          return false;
        }

        if ($('.row-stage .selection.selected').length == 0) {
          SubscribeEdit.showErrorMsg('请选择项目阶段');
          return false;
        }

        if (!validateType()) {
          return false;
        }

        if (!SubscribeEdit.validateProvince()) {
          return false;
        }        

        if (!validateSelection($('.row-subscribe'), '请选择是否订阅')) {
          return false;
        }

        var html = '<p>添加订阅失败。项目信息下的订阅器数量已达到上限。</p><p>注：招标、采购、项目，每一大类分别可以设置 5 组订阅器。</p>';
        SubscribeEdit.showErrorMsg(html);

        return false;
      });
    };

    return {
      init: init
    };
  })();    

  ZBW.Collection = (function() {
    var init;

    init = function() {
      var $container_collection = $('.container-collection');
      var $thead = $('thead', $container_collection);
      var $tbody = $('tbody', $container_collection);

      $('.container-collection .btn-manage').click(function() {
        $(this).removeClass('visible');
        $('.container-collection .btn-save').addClass('visible');

        $('.container-collection .item-checkbox').show();
      });

      $('.item-checkbox', $thead).change(function() {
        $('.item-checkbox', $tbody).prop('checked', $(this).is(':checked'));
      }).click(function(event) {
        event.stopPropagation();
      });

      $('.item-checkbox', $tbody).change(function() {
        var selected_count = $('.item-checkbox:checked', $tbody).length;
        if (selected_count == $('.item-checkbox', $tbody).length) {
          $('.item-checkbox', $thead).prop('checked', true);
        } else {
          $('.item-checkbox', $thead).prop('checked', false);
        }
      });

      $('.btn-save', $container_collection).click(function() {
        var selected_count = $('.item-checkbox:checked', $tbody).length;
        if (selected_count == 0) {
          ZBW.showMessageDialog('#message_dialog', '请选择要删除的收藏');
          return;
        }

        var $dialog = $('#remove_collection_dialog');
        var html = '<p>您确定要删除选中的' + selected_count + '条收藏吗？</p>';
        $('.dialog-content', $dialog).empty().append(html);
        $('.icons-close, .btn-cancel').off('click').click(function() {
          $dialog.removeClass('visible');
        });
        $('.btn-ok', $dialog).off('click').click(function() {
          // TODO
        });
        $dialog.addClass('visible');
      });
    };

    return {
      init: init
    }
  })();

  ZBW.Feedback = (function() {
    var init;

    init = function() {
      $('.container-feedback .btn-submit').click(function() {
        if ($('.input-feedback').val().trim().length == 0) {
          ZBW.showMessageDialog('#message_dialog', '请输入您的建议');
          return false;
        }

        var html = '<p>谢谢您提出的宝贵意见，我们将会和您一起努力创造一个更好的招标王。</p><p>建议一经采用，我们会联系您，招标王会为您送上一份礼物。</p>';
        ZBW.showMessageDialog('#message_dialog', html);

        return false;
      });
    };

    return {
      init: init
    };
  })();

  ZBW.QuickRegister = (function() {
    var init;

    init = function() {
      var $container = $('.block-register-info');
      $('.btn-register', $container).click(function() {
        var name = $('.name', $container).val().trim();
        if (name.length == 0) {
          ZBW.showMessageDialog('#message_dialog', '<p style="text-align:center;">请输入您的名字</p>');
          return false;
        }

        var company_name = $('.company-name', $container).val().trim();
        if (company_name.length == 0) {
          ZBW.showMessageDialog('#message_dialog', '<p style="text-align:center;">请输入您的公司名称</p>');
          return false;
        }

        var tel = $('.telphone', $container).val().trim();
        if (!ZBW.validateTelphone(tel)) {
          ZBW.showMessageDialog('#message_dialog', '<p style="text-align:center;">请输入正确的手机号码</p>');
          return false;
        }

        var verify_code = $('.verify-code', $container).val().trim();
        if (verify_code.length == 0) {
          ZBW.showMessageDialog('#message_dialog', '<p style="text-align:center;">请输入验证码</p>');
          return false;
        }

        // var $dialog = $('#quick_register_dialog');
        // var html = '<p style="text-align:center;">抱歉，该手机号码已被注册。</p>';
        // $('.dialog-content', $dialog).empty().append(html);
        // $('.btn-right', $dialog).off('click').text('忘记密码').click(function() {
        //   window.location.href = "wang_ji_mi_ma_1.html";
        // });
        // $('.btn-left', $dialog).text('确定');
        // $('.icons-close, .btn-left').off('click').click(function() {
        //   $dialog.removeClass('visible');
        // });
        // $dialog.addClass('visible');        

        var $dialog = $('#quick_register_dialog');
        var html = '<p>恭喜您，注册成功。</p><p>您的账号为：13810235484</p><p>您的密码为：13810235484</p>';
        $('.dialog-content', $dialog).empty().append(html);
        $('.btn-left', $dialog).off('click').text('立即完善资料').click(function() {
          window.location.href = "profile_edit.html";
        });
        $('.btn-right', $dialog).text('继续浏览');
        $('.icons-close, .btn-right').off('click').click(function() {
          $dialog.removeClass('visible');
        });
        $dialog.addClass('visible');

        return false;
      });

      $('.btn-send-verify-code', $container).click(function() {
        var $this = $(this);

        var tel = $('.telphone', $container).val().trim();
        if (!ZBW.validateTelphone(tel)) {
          ZBW.showMessageDialog('#message_dialog', '<p style="text-align:center;">请输入正确的手机号码</p>');
          return;
        }

        // TODO

        $this.prop('disabled', true);
        var count = 60;
        var tick = function() {
          if (--count == 0) {
            $this.prop('disabled', false);
            $(this).text('发送验证码');
          } else {
            $this.text(count + '秒');
            setTimeout(tick, 1000);
          }
        };
        setTimeout(tick, 0);
      });
    };

    return {
      init: init
    };
  })();

  ZBW.Search = (function() {
    var init, initSubConditions, initMainCondition;
    var $main_condition;
    var $container_conditions;

    function hideAllConditionSelection() {
      $('.container-selection', $container_conditions).removeClass('visible');
      $('.container-selection', $main_condition).removeClass('visible');
    }

    initMainCondition = function() {
      $('.condition-selected, .icons-blue-dropdown', $main_condition).click(function() {
        console.log('clicked');
        event.stopPropagation();
        
        var $parent = $(this).parent();
        var $container_selection = $('.container-selection', $parent);

        if ($container_selection.hasClass('visible')) {
          $container_selection.removeClass('visible');
          return;
        }

        hideAllConditionSelection();
        $container_selection.addClass('visible');        
      });

      $('.selection', $main_condition).click(function(event) {
        event.stopPropagation();

        var pos = parseInt($(this).attr('data-pos'));
        var $parent = $(this).parent().parent();

        $parent.attr('data-selected-pos', pos);
        $('.condition-selected', $parent).text($('.wrapper', $(this)).text());

        $('.selection.selected', $parent).removeClass('selected');

        if (pos != 0) {
          $(this).addClass('selected');
        }

        hideAllConditionSelection();

        // show corresponding sub conditions panel
        var val = $(this).attr('data-value');
        $('.container-conditions.current').removeClass('current');
        $('.container-' + val + '-conditions').addClass('current');
      });      
    };    

    initSubConditions = function() {
      $('.condition-selected, .container-icon', $container_conditions).click(function(event) {
        event.stopPropagation();
        
        var $parent = $(this).parent();
        var $container_selection = $('.container-selection', $parent);

        if ($container_selection.hasClass('visible')) {
          $container_selection.removeClass('visible');
          return;
        }

        hideAllConditionSelection();
        $container_selection.addClass('visible');
      });

      $('.selection', $container_conditions).click(function(event) {
        event.stopPropagation();

        var pos = parseInt($(this).attr('data-pos'));
        var $parent = $(this).parent().parent();

        $parent.attr('data-selected-pos', pos);
        $('.condition-selected', $parent).text($('.wrapper', $(this)).text());

        $('.selection.selected', $parent).removeClass('selected');

        if (pos != 0) {
          $(this).addClass('selected');
        }

        hideAllConditionSelection();
      });
    };

    init = function() {
      $main_condition = $('.container-search .condition-type');
      $container_conditions = $('.container-conditions');

      initMainCondition();
      initSubConditions();

      ZBW.QuickRegister.init();

      $('.container-conditions .btn-subscribe').click(function() {
        // var html = '<p>抱歉，添加当前条件到我的订阅失败。</p><p>个人中心-我的订阅-招标信息 ，订阅数量已达到上限。</p><p>注：招标、采购、项目，每一大类分别可以设置 5 组订阅器。</p>';
        // ZBW.showMessageDialog('#message_dialog', html);   

        ZBW.showMessageDialog('#message_dialog', '恭喜您成功添加当前条件到我的订阅');
      });

      $(document).click(function() {
        hideAllConditionSelection();
      });
    };

    return {
      init: init
    };
  })();

  ZBW.Publish = (function() {
    function validateInputText($row, msg) {
      var $input = $('input[type="text"]', $row);
      var $container = $input.parent();
      $('.hint', $container).remove();

      var val = $input.val().trim();
      if (val.length == 0) {
        var html = '<span class="hint">' + msg + '</span>';
        $container.append(html);
        return false;
      } else {
        return true;
      }
    }

    function validatePublisher() {
      var $container = $('.form-group-publisher > div:last-child');
      $('.hint', $container).remove();
      if ($('input[name="publisher"]:checked').length == 0) {
        var html = '<span class="hint">请选择发布单位</span>';
        $container.append(html);        
        return false;
      } else {
        return true;
      }
    }

    function validateDate() {
      var $container = $('.form-group-date > div:last-child');
      $('.hint', $container).remove();
      var val = $('input', $container).val().trim();
      if (!val.match(/^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}/)) {
        var html = '<span class="hint">请填写正确的开标日期</span>';
        $container.append(html);        
        return false;
      } else {
        return true;
      }
    }

    function validateTelphone() {
      var $container = $('.form-group-tel > div:last-child');
      $('.hint', $container).remove();
      var val = $('input', $container).val().trim();
      if (val.length == 0) {
        var html = '<span class="hint">请填写联系电话</span>';
        $container.append(html);        
        return false;
      } else {
        return true;
      }      
    }

    function validateContent(msg) {
      var $container = $('.form-group-content > div:last-child');
      $('.hint', $container).remove();
      var val = $('textarea', $container).val().trim();
      if (val.length == 0) {
        var html = '<span class="hint">' + msg + '</span>';
        $container.append(html);
        return false;
      } else {
        return true;
      }      
    }

    function initFileUpload() {
      $('.form-group-uploaded-files').on('click', '.btn-remove', function() {
        var $btn_remove = $(this);

        var $dialog = $('#remove_file_dialog');
        $('.dialog-content', $dialog).empty().append('<p style="text-align:center;">您确定要删除该文件吗？</p>');
        $('.icons-close, .btn-cancel').off('click').click(function() {
          $dialog.removeClass('visible');
        });
        $('.btn-ok', $dialog).off('click').click(function() {
          $btn_remove.parent().remove();
          $dialog.removeClass('visible');
        });
        $dialog.addClass('visible');
      });

      function bindEventForFileInput() {
        $('.form-group-uploaded-files > input[type="file"]').change(function() {
          var name = $(this).val().split('\\').pop();
          var html = '<div class="file"><span class="icons-yellow-folder"></span><span class="file-name">' + name + '</span><button type="button" class="btn-remove">删除</button>';
          $(html).prepend($(this).detach()).appendTo($('.container-uploaded-files'));

          html = '<input type="file" name="file[]">';
          $('.form-group-uploaded-files').prepend(html);
          bindEventForFileInput();
        });
      }

      bindEventForFileInput();

      $('.form-group-actions .btn-upload-file').click(function() {
        $('.form-group-uploaded-files > input[type="file"]').trigger('click');
      });
    }

    return {
      validateInputText: validateInputText,
      validatePublisher: validatePublisher,
      validateDate: validateDate,
      validateTelphone: validateTelphone,
      validateContent: validateContent,
      initFileUpload: initFileUpload
    };
  })();

  ZBW.PublishBid = (function() {
    var init;

    init = function() {
      var validateInputText = ZBW.Publish.validateInputText;

      ZBW.Publish.initFileUpload();

      var $container_form = $('.container-publish-form');
      $('.btn-submit', $container_form).click(function() {
        if (!validateInputText($('.form-group-bid-company'), '请填写招标单位')) {
          return false;
        }

        if (!ZBW.Publish.validatePublisher()) {
          return false;
        }

        if (!ZBW.Publish.validateDate()) {
          return false;
        }

        if (!ZBW.Publish.validateTelphone()) {
          return false;
        }

        if (!validateInputText($('.form-group-title'), '请填写公告标题')) {
          return false;
        }

        if (!ZBW.Publish.validateContent('请填写招标内容')) {
          return false;
        }

        var html = '<p style="font-size:18px;">提交成功！</p><p>后台工作人员进行审核后，即可将您的公告发布出去。</p>';
        ZBW.showMessageDialog('#message_dialog', html);

        return false;
      });
    };

    return {
      init: init
    };
  })();

  ZBW.PublishCG = (function() {
    var init;

    init = function() {
      var validateInputText = ZBW.Publish.validateInputText;

      ZBW.Publish.initFileUpload();

      var $container_form = $('.container-publish-form');
      $('.btn-submit', $container_form).click(function() {
        if (!validateInputText($('.form-group-bid-company'), '请填写采购单位')) {
          return false;
        }

        if (!ZBW.Publish.validatePublisher()) {
          return false;
        }

        if (!ZBW.Publish.validateDate()) {
          return false;
        }

        if (!ZBW.Publish.validateTelphone()) {
          return false;
        }

        if (!validateInputText($('.form-group-title'), '请填写公告标题')) {
          return false;
        }

        if (!ZBW.Publish.validateContent('请填写采购内容')) {
          return false;
        }

        var html = '<p style="font-size:18px;">提交成功！</p><p>后台工作人员进行审核后，即可将您的公告发布出去。</p>';
        ZBW.showMessageDialog('#message_dialog', html);        

        return false;
      });
    };

    return {
      init: init
    };
  })();

  ZBW.BidDetails = (function() {
    var init, initProjectOtherStage;

    initProjectOtherStage = function() {
      var $container_actions = $('.container-bid-actions');
      $('.btn-view-project-other-stage', $container_actions).click(function() {
        var $dialog = $('#choose_other_stage_dialog');
        $('.icons-close', $dialog).off('click').click(function() {
          $dialog.removeClass('visible');
        });
        $dialog.addClass('visible');
      });
    };

    init = function() {
      initProjectOtherStage();
    };

    return {
      init: init,
      initProjectOtherStage: initProjectOtherStage
    };
  })();

  ZBW.BidDetailsNotLogin = (function() {
    var init;

    function showDialog(msg) {
      var $dialog = $('#login_register_dialog')
      $('.dialog-content', $dialog).empty().append(msg);
      $('.icons-close', $dialog).off('click').click(function() {
        $dialog.removeClass('visible');
      });
      $dialog.addClass('visible');
    }

    init = function() {
      var $container_actions = $('.container-bid-actions');
      $('.btn-download', $container_actions).click(function(event) {
        var html = '<p>抱歉，招标文件下载失败</p><p>招标文件下载功能需登录后才能使用。</p>';
        showDialog(html);

        event.preventDefault();
      });

      $('.btn-collect', $container_actions).click(function(event) {
        var html = '<p>抱歉，收藏项目失败</p><p>收藏项目功能需登录后才能使用。</p>';
        showDialog(html);

        event.preventDefault();
      });

      ZBW.BidDetails.initProjectOtherStage();
    };

    return {
      init: init
    };
  })();

  ZBW.BidDetailsFreeAccount = (function() {
    var init;

    init = function() {
      var $container_actions = $('.container-bid-actions');
      $('.btn-collect', $container_actions).click(function(event) {
        var html = '<p>恭喜您，收藏成功。</p><p>您可以去 个人中心-我的收藏 中查看收藏的内容</p>';
        ZBW.showMessageDialog('#message_dialog', html);

        event.preventDefault();
      });

      ZBW.BidDetails.initProjectOtherStage();
    };

    return {
      init: init
    };    
  })();

  ZBW.ProjectDetails = (function() {
    var init;

    function fixWidthForProgressGraph() {
      var $graph = $('.progress-graph');
      var container_width = $graph.width() - 80;
      var icons_width = 0;
      $('.progress-stage', $graph).each(function(idx, e) {
        icons_width += $(e).width();
      });

      var $seprators = $('.progress-separator', $graph);

      $seprators.css({
        width: (container_width - icons_width) / $seprators.length + 'px'
      });
    }

    init = function() {
      fixWidthForProgressGraph();
    };

    return {
      init: init
    };
  })();

  ZBW.Home = (function() {
    var init;

    init = function() {
      ZBW.makeImgSlider('.header-img-slider .img-slider', 400.0 / 1200.0);

      var $zbinfo = $('.block-zbxx');

      $('.container-tabs .tab', $zbinfo).hover(function() {
        $('.content.current', $zbinfo).removeClass('current');
        $('.tab.selected').removeClass('selected');

        var name = $(this).attr('data-name');
        $(this).addClass('selected');
        $('.content-' + name, $zbinfo).addClass('current');
      }, function() {
      });      
    };

    return {
      init: init
    };
  })();

})(jQuery);