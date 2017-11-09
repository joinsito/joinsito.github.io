var DEFAULT_BLOCK_NUMBER = 4;
var BlockModel = Backbone.Model.extend({
  idAttribute: 'title',
  attributes: {
  title: '',
  description: '',
  images: []
}
});
var Blocks = Backbone.Collection.extend({
  initialize: function (data) {
    this.url = data.url;
  }, 
  model: BlockModel
});
var BlockView = Backbone.View.extend({
  template: _.template('<div class="blocks" style="background-image:url(<%= images[this.getRandomArbitrary(0,images.length-1)] %>);"><h1><%= title %></h1><p><%= description %></p></div>'),
  initialize: function (block) {
    this.model = block;
  },
  getRandomArbitrary: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  render: function() {
    this.$el.html(this.template(this.attributes));
    return this.template(this.attributes)
  }
});
var blockview = [];
var currentBlock = 0;
var Carousel = Backbone.View.extend({
      events: {
        "click .next":  "gonext",
        "click .prev":  "goprev"
      },
      initialize: function (data) {
        if (data.blockNum!=null) {
          DEFAULT_BLOCK_NUMBER =data.blockNum;
        }
      },
      goprev: function () {
        if (!$('.prev').hasClass('disabled')) {
          this.render('prev');
        }
      },
      gonext: function () {
        if (!$('.next').hasClass('disabled')) {
          this.render('next');
        }
      },
      template: _.template('<ul class="justify-content-center pagination center"><li class="prev carousel-prev page-item"><a class="page-link" href="#">&larr;</a></li><li class="next page-item carousel-next"><a class="page-link" href="#">&rarr;</a></li></ul><div class="carousel-elements"><% for (i=0;i<DEFAULT_BLOCK_NUMBER;i++) {%><div><%= blockview[i] %></div><% } %></div>'),
      render: function(dir = null) {
        if (blockview.length===0) {
          _.each(this.collection.models,function(block) {
            blockview.push(new BlockView(block).render());
            currentBlock = 0;
          });
          this.$el.html(this.template(blockview));
          this.checklinks();
        }else {
          blockview = [];
          if (dir==='next') {
            currentBlock += DEFAULT_BLOCK_NUMBER;
          }else if(dir==='prev') {
            currentBlock -= DEFAULT_BLOCK_NUMBER;
          }
          _.each(this.collection.models,function(block,i) {
            if (currentBlock<=i) {
              blockview.push(new BlockView(block).render());
            }
          });
          $('.carousel-elements').fadeOut("slow", function () {
            this.$el.html(this.template(blockview));
            this.checklinks();
          }.bind(this));
        }
        return this;
      },
      checklinks: function() {
          if (currentBlock+DEFAULT_BLOCK_NUMBER>=this.collection.length) {
            $('.next').addClass('disabled');
          }else {
            $('.next').removeClass('disabled');
          }
          if (currentBlock===0) {
            $('.prev').addClass('disabled');
          }else {
            $('.prev').removeClass('disabled');
          }
      }
});