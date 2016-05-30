/**
 * Point group model
 */

T.Models.PointGroup = new function() {
    var self = this;

    /**
     * Parse 'group' response element
     * @param response
     * @returns point group model object
     */
    self.parse = function (response) {
        var group, points, pointId;
        var response = $(response);

        group = {
            'id' : response.attr('id'),
            'name' : response.attr('name')
        };

        points = response.find('point');

        group['points'] = {
            queue   : [],
            values  : {}
        };

        if (points.length) {
            $.each(response.find('point'), function (key, point) {
                pointId = $(point).attr('id');

                group['points']['queue'].push(pointId)
                group['points']['values'][pointId] = T.Models.Point.parse(point);
            });
        }

        return group;
    };
};