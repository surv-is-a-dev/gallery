### eslint-disable ###
###
0znzw made an extension in coffeescript
###
((Scratch) ->
  ArgumentType = Scratch.ArgumentType
  BlockType = Scratch.BlockType
  Cast = Scratch.Cast
  class Extension
    constructor: () ->
      @objects = {}
      @currentObject = ''
      @currentPath = []
      @selected = null
    getInfo: ->
      res = {
        id: '0znzwCoffeeScriptObjectExt'
        name: 'Objects (w/ CoffeeScript)'
        blocks: [{
          opcode: 'createObject',
          text: 'create object [NAME]'
          arguments: {
            NAME: {
              type: Scratch.ArgumentType.STRING
              defaultValue: 'my object'
            }
          }
          blockType: Scratch.BlockType.COMMAND
        }, {
          opcode: 'createSubObject',
          text: 'create object [NAME] in current object'
          arguments: {
            NAME: {
              type: Scratch.ArgumentType.STRING
              defaultValue: 'my sub-object'
            }
          }
          blockType: Scratch.BlockType.COMMAND
        }, {
          opcode: 'deleteObject',
          text: 'delete object [NAME]'
          arguments: {
            NAME: {
              type: Scratch.ArgumentType.STRING
              defaultValue: 'my object'
            }
          }
          blockType: Scratch.BlockType.COMMAND
        }, {
          opcode: 'useObject',
          text: 'use object [NAME]'
          arguments: {
            NAME: {
              type: Scratch.ArgumentType.STRING
              defaultValue: 'my object'
            }
          }
          blockType: Scratch.BlockType.COMMAND
        }, {
          opcode: 'setPath',
          text: 'set path to [PATH]'
          arguments: {
            PATH: {
              type: Scratch.ArgumentType.STRING
              defaultValue: '/my sub-object'
            }
          }
          blockType: Scratch.BlockType.COMMAND
        }, '---', {
          opcode: 'setKey'
          text: 'set [KEY] to [VALUE]'
          arguments: {
            KEY: {
              type: Scratch.ArgumentType.STRING
              defaultValue: 'foo'
            }
            VALUE: {
              type: Scratch.ArgumentType.STRING
              defaultValue: 'bar'
            }
          }
          blockType: Scratch.BlockType.COMMAND
        }, {
          opcode: 'getKey'
          text: 'get [KEY]'
          arguments: {
            KEY: {
              type: Scratch.ArgumentType.STRING
              defaultValue: 'foo'
            }
          }
          blockType: Scratch.BlockType.REPORTER
        }]
      }
      res
    # Internal utilitys
    _updateMainObject: () ->
      object = @currentObject
      ((() ->
        if path.trim() isnt ''
          object = object[path]
          true
        else
          false
      )()) for path in @currentPath
      @selected = object
      object
    # Setup
    createObject: ({ NAME }) ->
      NAME = Cast.toString NAME
      @objects[NAME] = new Object
      ''
    createSubObject: ({ NAME }) ->
      NAME = Cast.toString NAME
      @selected[NAME] = new Object
      ''
    deleteObject: ({ NAME }) ->
      NAME = Cast.toString NAME
      delete @objects[NAME]
      ''
    useObject: ({ NAME }) ->
      NAME = Cast.toString NAME
      if @objects[NAME]
        @currentObject = @objects[NAME]
        @currentPath = []
        @selected = @currentObject
      ''
    setPath: ({ PATH }) ->
      PATH = Cast.toString PATH
      if PATH is '' or PATH is '/'
        @currentPath = []
      else
        @currentPath = PATH.split('/')
      @_updateMainObject()
      ''
    # Actually using the object
    setKey: ({ KEY, VALUE }) ->
      KEY = 'key_' + Cast.toString KEY
      @selected[KEY] = VALUE
      ''
    getKey: ({ KEY }) ->
      KEY = 'key_' + Cast.toString KEY
      @selected[KEY]
  Scratch.extensions.register(new Extension)
) Scratch