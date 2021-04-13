package chess.controller.command;

import chess.domain.board.Board;

public final class Finish extends AbstractCommand{

    private static final String POSSIBLE_COMMANDS = "start, status, exit";

    public Finish(final Board board) {
        super(board);
    }

    @Override
    public Command execute(final String command) {
        if (commandIsStatus(command)) {
            return this;
        }
        if (EXIT_COMMAND.equals(command)) {
            return new Exit(board);
        }
        if (START_COMMAND.equals(command)) {
            return new Play(new Board());
        }
        printErrorMessage(POSSIBLE_COMMANDS);
        return this;
    }
}
