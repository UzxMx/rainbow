(function($) {
  var ZBW = window.ZBW || {};
  window.ZBW = ZBW;

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
    var $header_main, $input_search;

    function onSearch() {
      var val = $input_search.val().trim();
      if (val != '') {
        console.log('search: ' + val);
      }
    }

    init = function() {
      $header_main = $('#page-header .header-main');
      $input_search = $('.input-search', $header_main);

      // search function
      $('.icons-search', $header_main).click(function() {
        onSearch();
      });
      $input_search.keyup(function(event) {
        if (event.keyCode == 13) {
          onSearch();
        }
      });

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

    };

    return {
      init: init
    };
  })();

  ZBW.Register.Step2 = function() {
    var init, initValidation;
    var $dropdowns;

    function hideSelection() {
      $('.container-selection', $dropdowns).removeClass('visible');
    }

    init = function() {
      $dropdowns = $('.container-register .dropdown');
      $('.wrapper', $dropdowns).click(function(event) {
        event.stopPropagation();
        
        var $parent = $(this).parent();
        var $container_selection = $('.container-selection', $parent);

        if ($container_selection.hasClass('visible')) {
          $container_selection.removeClass('visible');
          return;
        }

        hideSelection();
        $container_selection.addClass('visible');
      });

      $('.selection', $dropdowns).click(function() {
        event.stopPropagation();

        // var $parent = $(this).parent().parent();
        // var $input_text = $('input[type=text]', $parent.parent());
        // var val = $input_text.val();
        // if (val.length == 0) {
        //   val += ' ' + $('.wrapper', $(this)).text(); 
        // } else {
        //   val = $('.wrapper', $(this)).text();
        // }

        // $('.hint', $parent.parent()).removeClass('highlight');

        hideSelection();
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

})(jQuery);