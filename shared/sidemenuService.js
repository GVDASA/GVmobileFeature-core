angular.module('core')

.service('sidemenuService', function() {
    var originalCfg = {
        fotoUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/hAy1odHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4NkYyNzYwODAxOEUxMUUzQTZERkFFRjQ1MkRFNzBEMyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo4NkYyNzYwOTAxOEUxMUUzQTZERkFFRjQ1MkRFNzBEMyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjg2RjI3NjA2MDE4RTExRTNBNkRGQUVGNDUyREU3MEQzIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjg2RjI3NjA3MDE4RTExRTNBNkRGQUVGNDUyREU3MEQzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/9sAQwAFAwQEBAMFBAQEBQUFBgcMCAcHBwcPCwsJDBEPEhIRDxERExYcFxMUGhURERghGBodHR8fHxMXIiQiHiQcHh8e/9sAQwEFBQUHBgcOCAgOHhQRFB4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4e/8AAEQgAYABgAwERAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A+pqokKACgAoAKACgAoAKACgBCaAGMaAI2NAFigAoAKACgAJwMntQBSm1bToWKvdx5HZfm/lQAQ6tp0zBUu48ns3y/wA6ALoORkd6AA0ARk0ANY0ARMaALdABQAUAR3U8dtA88zbUQZJoA43VtVub9yCxjgz8sYP8/U07AZ9ABQBf0rVbiwcAMZIf4oyf5ehosB19vPHcwJPC25HGQaQDmPFAEbGgCNjQBeoAKACgDmfGN0TLFZqflUeY3uT0/wA+9CA5+mAUABoAaTQBu+EboiWW0Y/Kw3qPQjr/AJ9qQHRE4FAEbGgCJjQBpUAFABQBxnijP9tTZ/urj8qaAzKAA0ANJoAaTQBoeGif7Zix/dbP5UMDrmNICJjQBC7UAa9ABQAUAc14xtWEsV4oypHlv7HtTQHPUAITQA0mgBjGgDd8JW5Mkt4w4A2IfU96GBvsaQETmgCF2oA26ACgAoAZcQx3EDwyruRxgigDjNX0m4sGLYMkGeJAOn19KYGZmgBjH8qAL2maXcXzhsGODvIR1+nrQB1cMcdvCsMK7UQYApAIzUAQsxzQBE7UAb9ABQAUAUtS1O0sBiaTLnpGvLH/AAoAxH8Tv5vFovldwX+Y/wBKLAI1/wCH7n5p7Mo56/u//iTT1Aj+36Bb/NBaF2HT93/8VQBGfEz+bzaL5XYB/m/wpWA07LU7W9GIZMP3RuGH+NAErtQBE7UAQu1AHSUAFAGX4g1P7BAEiINxIPl/2R/eoA4yR2d2d2ZmbksTkk0wGMaAGE0AMJoAjY5oAaHZHDoxVl5BB5FAHT6Lqf22ApJgToPm/wBoetIC47elAELHJoA6mgAoA4HVro3moTTknBbC+yjpTApk0ANJoAYxoAjZqAI2OKAI2NAEmn3Rtb6KYHgNhvdT1oA692z0/OkBGTmgDrKAIL9yllOw4IiYj8jQB55ngfSmA0mgBjGgBjHFAEZNAEbGgCNzQBE7daAOztWL2cLE8mNT+lIBWODQB1xoAq6kf+Jfc/8AXJv5GgDz4/0pgNY0ARsaAGE0ARsaAInNAEbGgCJjxQB2dkf9Bg/65r/KkBJQB//Z',
        descricao: 'Loading ... ',
        extradata: [
            /*{
            descricao: "Unidade X",
            class: 'unidade'
        }, {
            descricao: "Curso X",
            class: 'curso'
        }, {
            descricao: "Algo",
            class: 'algo'
        }*/
        ],
        profileMenus: [
            /*{
            action: $rootScope.selectModulo,
            descricao: 'Mudar MÓDULO',
            iconCls: 'perfil'
        }, {
            action: $rootScope.selectAluno,
            descricao: 'Mudar perfil',
            iconCls: 'perfil'
        }, {
            action: $rootScope.selectCurso,
            descricao: 'Ver outros cursos',
            iconCls: 'formando'
        }*/
        ],
        loadDefaults: function() {
            angular.extend(this, originalCfg);
        }
    };
    return angular.extend({
        addProfileMenus: function(value) {
            var me = this;
            var args = angular.isArray(value) ? value : [value];
            angular.forEach(args, function(item) {
                me.profileMenus.push(item);
            });
        },
        removeProfileMenus: function(value) {
            var index;
            if ((index = this.profileMenus.indexOf(value)) != -1) {
                this.profileMenus.splice(index, 1);
            };
        }
    }, originalCfg);
});