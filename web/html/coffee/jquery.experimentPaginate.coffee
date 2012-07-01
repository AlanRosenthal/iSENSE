#Define jQuery
$ = jQuery

#Extend jQuery
$.fn.experimentPaginate = ( options = null ) ->

    #Default settings
    settings =
        start : 0
        limit : 20
        
    #Overwrite if options aren't empty
    settings = $.extend settings, options
    
    #Calculate end number for page_info
    if (settings.start + settings.limit) > $('#session_list').children().length
        end = $('#session_list').children().length
    else
        end = settings.start + settings.limit
        
    #Define page_controls
    page_controls = """
                    <div id='page_controls'>
                        <div id='page_back'>
                            <a class='page_button'>Back!</a>
                        </div>
                        <div id='page_info'>
                            <p>Displaying Session ##{settings.start} to Session ##{end}</p>
                        </div>
                        <div id='page_forward'>
                            <a class='page_button'>Next!</a>
                        </div>
                    </div>
                    """
                    
    #My version of Main()
    update = (target, settings) ->
    
        #Strip page controls
        if $('#page_controls')
            $('#page_controls').remove()
        
        #Append page controls
        $(target).parent().append(page_controls)
        
        #En/Disable Back button
        if settings.start - settings.limit >= 0
            $('#page_back a').click () ->
                $('#session_list').experimentPaginate({ start : (settings.start - settings.limit), limit : settings.limit});
        else
            $('#page_back a').addClass 'page_disabled'
            
        #En/Disable Next button
        if (settings.start + settings.limit) < $('#session_list').children().length
            $('#page_forward a').click () ->
                $('#session_list').experimentPaginate({ start : (settings.start + settings.limit), limit : settings.limit});    
        else
            $('#page_forward a').addClass 'page_disabled'
        
        #Hide divs
        $(target).children().each (index) ->
            $(this).hide()
            if index >= settings.start and index < ( settings.start + settings.limit )
                $(this).show()
            
        #Call "Main()" on each .exp..ate() target
    return @each ()->
        update(this, settings)