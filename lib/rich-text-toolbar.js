var firepad = firepad || { };

firepad.RichTextToolbar = (function(global) {
  var utils = firepad.utils;

  function RichTextToolbar(imageInsertionUI) {
    this.imageInsertionUI = imageInsertionUI;
    this.element_ = this.makeElement_();
  }

// , [
    // 'bold', 'paragraph', 'italic', 'underline', 'strike', 'font', 'font-size', 'color',
    // 'left', 'center', 'right', 'unordered-list', 'ordered-list', 'todo-list', 'indent-increase', 'indent-decrease',
    // 'undo', 'redo', 'insert-image', 'a']
  utils.makeEventEmitter(RichTextToolbar);

  RichTextToolbar.prototype.element = function() { return this.element_; };

  RichTextToolbar.prototype.makeButton_ = function(eventName, iconName) {
    var self = this;
    iconName = iconName || eventName;
    var btn = utils.elt('a', [utils.elt('i', '', { 'class': 'fa-' + iconName } )], { 'class': 'firepad-btn' });
    utils.on(btn, 'click', utils.stopEventAnd(function() { self.trigger(eventName); }));
    return btn;
  }

  RichTextToolbar.prototype.makeElement_ = function() {
    var self = this;

    // var font = this.makeFontDropdown_();
    // var fontSize = this.makeFontSizeDropdown_();
    var color = this.makeColorDropdown_();
    var paragraph = this.makeParagrahDropdown_();

    var toolbarOptions = [
      // utils.elt('div', [font], { 'class': 'firepad-btn-group'}),
      utils.elt('div', [paragraph], { 'class': 'firepad-btn-group'}),
      // utils.elt('div', [fontSize], { 'class': 'firepad-btn-group'}),
      // utils.elt('div', [color], { 'class': 'firepad-btn-group'}),
      utils.elt('div', [
        self.makeButton_('bold'), 
        self.makeButton_('italic'), 
        
        // self.makeButton_('underline'), 
        self.makeButton_('strike', 'strikethrough')], 
        { 'class': 'firepad-btn-group'}),

      utils.elt('div', [self.makeButton_('a', 'chain'),self.makeButton_('remove-a', 'chain-broken')], { 'class': 'firepad-btn-group'}),

      utils.elt('div', [self.makeButton_('unordered-list', 'list-ul'), self.makeButton_('ordered-list', 'list-ol')], { 'class': 'firepad-btn-group'}),
      // utils.elt('div', [self.makeButton_('unordered-list', 'list-2'), self.makeButton_('ordered-list', 'numbered-list'), self.makeButton_('todo-list', 'list')], { 'class': 'firepad-btn-group'}),
      utils.elt('div', [self.makeButton_('indent-decrease', 'outdent'), self.makeButton_('indent-increase', 'indent')], { 'class': 'firepad-btn-group'}),
      utils.elt('div', [self.makeButton_('left', 'align-left'), self.makeButton_('center', 'align-center'), self.makeButton_('right', 'align-right')], { 'class': 'firepad-btn-group'}),
      utils.elt('div', [self.makeButton_('undo', 'rotate-left'), self.makeButton_('redo', 'rotate-right')], { 'class': 'firepad-btn-group'})
    ];

    if (self.imageInsertionUI) {
      toolbarOptions.push(utils.elt('div', [self.makeButton_('insert-image', 'file-picture-o')], { 'class': 'firepad-btn-group' }));
    }

    var toolbarWrapper = utils.elt('div', toolbarOptions, { 'class': 'firepad-toolbar-wrapper' });
    var toolbar = utils.elt('div', null, { 'class': 'firepad-toolbar' });
    toolbar.appendChild(toolbarWrapper)

    return toolbar;
  };

  RichTextToolbar.prototype.makeParagrahDropdown_ = function() {
    var fonts = [ ['Normal', ''], 
                  ['Heading 1', 'h1'], ['Heading 2', 'h2'], ['Heading 3', 'h3'], 
                  ['Heading 4', 'h4'], ['Heading 5', 'h5'], ['Heading 6', 'h6'], 
                  ['Code', 'code'], 
                  ['Quote', 'bq'] ];

    var items = [];
    for(var i = 0; i < fonts.length; i++) {
      var content = utils.elt('span', fonts[i][0]);
      content.setAttribute('class', 'firepad-p-' + fonts[i][1]);
      // content.setAttribute('style', 'font-family:' + fonts[i]);
      items.push({ content: content, value: fonts[i][1] });
    }
    return this.makeDropdown_('Paragraph', 'paragraph', items);
  };

  RichTextToolbar.prototype.makeFontDropdown_ = function() {
    // NOTE: There must be matching .css styles in firepad.css.
    var fonts = ['Arial', 'Comic Sans MS', 'Courier New', 'Impact', 'Times New Roman', 'Verdana'];

    var items = [];
    for(var i = 0; i < fonts.length; i++) {
      var content = utils.elt('span', fonts[i]);
      content.setAttribute('style', 'font-family:' + fonts[i]);
      items.push({ content: content, value: fonts[i] });
    }
    return this.makeDropdown_('Font', 'font', items);
  };

  RichTextToolbar.prototype.makeFontSizeDropdown_ = function() {
    // NOTE: There must be matching .css styles in firepad.css.
    var sizes = [9, 10, 12, 14, 18, 24, 32, 42];

    var items = [];
    for(var i = 0; i < sizes.length; i++) {
      var content = utils.elt('span', sizes[i].toString());
      content.setAttribute('style', 'font-size:' + sizes[i] + 'px; line-height:' + (sizes[i]-6) + 'px;');
      items.push({ content: content, value: sizes[i] });
    }
    return this.makeDropdown_('Size', 'font-size', items, 'px');
  };

  RichTextToolbar.prototype.makeColorDropdown_ = function() {
    var colors = ['black', 'red', 'green', 'blue', 'yellow', 'cyan', 'magenta', 'grey'];

    var items = [];
    for(var i = 0; i < colors.length; i++) {
      var content = utils.elt('div');
      content.className = 'firepad-color-dropdown-item';
      content.setAttribute('style', 'background-color:' + colors[i]);
      items.push({ content: content, value: colors[i] });
    }
    return this.makeDropdown_('Color', 'color', items);
  };

  RichTextToolbar.prototype.makeDropdown_ = function(title, eventName, items, value_suffix) {
    value_suffix = value_suffix || "";
    var self = this;
    var button = utils.elt('a', title + ' \u25be', { 'class': 'firepad-btn firepad-dropdown' });
    var list = utils.elt('ul', [ ], { 'class': 'firepad-dropdown-menu' });
    button.appendChild(list);

    var isShown = false;
    function showDropdown() {
      if (!isShown) {
        list.style.display = 'block';
        utils.on(document, 'click', hideDropdown, /*capture=*/true);
        isShown = true;
      }
    }

    var justDismissed = false;
    function hideDropdown() {
      if (isShown) {
        list.style.display = '';
        utils.off(document, 'click', hideDropdown, /*capture=*/true);
        isShown = false;
      }
      // HACK so we can avoid re-showing the dropdown if you click on the dropdown header to dismiss it.
      justDismissed = true;
      setTimeout(function() { justDismissed = false; }, 0);
    }

    function addItem(content, value) {
      if (typeof content !== 'object') {
        content = document.createTextNode(String(content));
      }
      var element = utils.elt('a', [content]);

      utils.on(element, 'click', utils.stopEventAnd(function() {
        hideDropdown();
        self.trigger(eventName, value + value_suffix);
      }));

      list.appendChild(element);
    }

    for(var i = 0; i < items.length; i++) {
      var content = items[i].content, value = items[i].value;
      addItem(content, value);
    }

    utils.on(button, 'click', utils.stopEventAnd(function() {
      if (!justDismissed) {
        showDropdown();
      }
    }));

    return button;
  };

  return RichTextToolbar;
})();
