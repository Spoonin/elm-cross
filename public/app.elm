module App exposing (..)

import Html exposing (..)
import Html.Events exposing (..)


type alias Model =
    Int


type Msg
    = Increment
    | Decrement


initialModel : Model
initialModel =
    0


view : Model -> Html Msg
view model =
    div []
        [ button [ onClick Decrement ] [ text "-" ]
        , text (toString model)
        , button [ onClick Increment ] [ text "+" ]
        ]


update : Msg -> Model -> Model
update msg model =
    case msg of
        Increment ->
            model + 1

        Decrement ->
            model - 1


main : Program Never Model Msg
main =
    beginnerProgram
        { model = initialModel
        , view = view
        , update = update
        }
